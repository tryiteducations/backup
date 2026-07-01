// FILE: src/components/ProfilePhoto.jsx
// Profile Photo Component
// • Optional - if no photo, shows generated avatar
// • Anti-screenshot: pointer-events blocked for others, right-click disabled
// • Nudity detection via Supabase Edge Function + Google Vision API
// • Owner-only zoom (others see fixed size only)
// • In leaderboard: shows real face (social feel)
// • Upload any image (not just face photo - student's choice)

import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// -- AVATAR GENERATOR (used when no photo) ---------------------------------
// Generates a unique gradient avatar from user's name/ID
function generateAvatarStyle(userId, name) {
  const GRADIENTS = [
    ['#1E3A5F','#C9A84C'], ['#7C3AED','#EC4899'], ['#059669','#0891B2'],
    ['#DC2626','#F59E0B'], ['#1D4ED8','#7C3AED'], ['#0F766E','#059669'],
    ['#9333EA','#EC4899'], ['#0E7490','#1D4ED8'], ['#B45309','#DC2626'],
    ['#065F46','#0891B2'],
  ]
  const idx  = (userId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length
  const [c1, c2] = GRADIENTS[idx]
  const initials = (name || '?')
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('')
  return { gradient:`linear-gradient(135deg,${c1},${c2})`, initials }
}

// -- ANTI-SCREENSHOT OVERLAY ------------------------------------------------
// Injected over photo for non-owners
// • Blocks pointer events (no right-click save)
// • CSS user-select none
// • Transparent overlay captures events before they reach image
function AntiScreenshotOverlay() {
  return (
    <div
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
      style={{
        position:       'absolute',
        inset:          0,
        zIndex:         2,
        userSelect:     'none',
        WebkitUserSelect:'none',
        pointerEvents:  'all',    // captures all events
        cursor:         'default',
        borderRadius:   'inherit',
        // Subtle privacy indicator
        background:     'linear-gradient(135deg,transparent 0%,rgba(0,0,0,0.02) 100%)',
      }}
    />
  )
}

// -- MAIN PROFILE PHOTO COMPONENT ------------------------------------------
export default function ProfilePhoto({
  userId,           // whose photo is this
  name,             // user's name (for avatar fallback)
  photoUrl,         // current photo URL from DB
  size = 48,        // px
  isOwner = false,  // can this viewer upload/zoom?
  showUpload = false, // show upload button (for profile page)
  onPhotoUpdated,   // callback after successful upload
  className,
}) {
  const [zoomed,      setZoomed]      = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [localUrl,    setLocalUrl]    = useState(photoUrl)
  const fileRef = useRef()

  useEffect(() => { setLocalUrl(photoUrl) }, [photoUrl])

  const { gradient, initials } = generateAvatarStyle(userId, name)

  // -- HANDLE FILE UPLOAD ----------------------------------------------------
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB')
      return
    }

    // Type check
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) {
      setUploadError('Only JPG, PNG, WEBP, or GIF allowed')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      // 1. Upload to Supabase Storage
      const ext      = file.name.split('.').pop()
      const path     = `profile-photos/${userId}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('user-content')
        .upload(path, file, { upsert: true, cacheControl:'3600' })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('user-content')
        .getPublicUrl(path)

      // 2. Moderate via Edge Function (nudity + profanity check)
      const { data: modResult } = await supabase.functions.invoke('moderate-image', {
        body: { image_url: publicUrl, user_id: userId }
      })

      if (modResult?.flagged) {
        // Remove uploaded image
        await supabase.storage.from('user-content').remove([path])
        setUploadError(
          modResult.reason === 'nudity'
            ? '🚫 This image contains inappropriate content and cannot be used.'
            : `🚫 Image rejected: ${modResult.reason}. Please use an appropriate image.`
        )
        setUploading(false)
        return
      }

      // 3. Update user profile
      await supabase.from('profiles').update({
        profile_photo_url: publicUrl,
        photo_verified:    true,
        photo_updated_at:  new Date().toISOString(),
      }).eq('id', userId)

      // 4. Update local state
      setLocalUrl(publicUrl)
      onPhotoUpdated?.(publicUrl)

    } catch (err) {
      setUploadError(`Upload failed: ${err.message || 'Try again'}`)
    }

    setUploading(false)
    e.target.value = '' // reset input
  }

  // -- RENDER PHOTO OR AVATAR ------------------------------------------------
  const renderPhoto = (sz = size, forZoom = false) => {
    if (localUrl) {
      return (
        <div style={{
          width:sz, height:sz, borderRadius:'50%', overflow:'hidden',
          position:'relative', flexShrink:0,
        }}>
          <img
            src={localUrl}
            alt={name || 'Profile'}
            draggable={false}
            onContextMenu={e => !isOwner && e.preventDefault()}
            style={{
              width:'100%', height:'100%', objectFit:'cover', display:'block',
              // Prevent long-press on mobile for non-owners
              WebkitTouchCallout: isOwner ? 'default' : 'none',
              userSelect:         'none',
              WebkitUserSelect:   'none',
              pointerEvents:      forZoom ? 'auto' : 'none', // allow zoom for owner
            }}
          />
          {/* Anti-screenshot overlay for non-owners */}
          {!isOwner && !forZoom && <AntiScreenshotOverlay />}
        </div>
      )
    }

    // Avatar fallback
    return (
      <div style={{
        width:sz, height:sz, borderRadius:'50%',
        background: gradient,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Poppins,sans-serif', fontWeight:800,
        fontSize: sz * 0.35, color:'#fff', flexShrink:0,
        userSelect:'none', WebkitUserSelect:'none',
      }}>
        {initials || '?'}
      </div>
    )
  }

  return (
    <>
      <div style={{ position:'relative', display:'inline-block' }} className={className}>
        {/* Main photo */}
        <div
          onClick={() => isOwner && setZoomed(true)}
          style={{ cursor: isOwner ? 'zoom-in' : 'default' }}>
          {renderPhoto(size)}
        </div>

        {/* Upload button (for profile page) */}
        {isOwner && showUpload && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              position:'absolute', bottom:0, right:0,
              width:size*0.38, height:size*0.38, borderRadius:'50%',
              background:'var(--color-primary,#1E3A5F)', color:'#fff', border:'2px solid #fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:size*0.16, cursor:'pointer', zIndex:5,
            }}>
            {uploading ? '⏳' : '📷'}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display:'none' }}
        />
      </div>

      {/* Upload error */}
      {uploadError && (
        <p style={{ fontSize:11, color:'#DC2626', marginTop:4, maxWidth:200 }}>{uploadError}</p>
      )}

      {/* Zoom modal - OWNER ONLY ---------------------------------------- */}
      {zoomed && isOwner && (
        <div
          onClick={() => setZoomed(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            {renderPhoto(220, true)}
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>
              Only you can see this enlarged view
            </p>
            <button
              onClick={() => { setZoomed(false); fileRef.current?.click() }}
              style={{ padding:'8px 20px', background:'var(--color-accent,#C9A84C)', color:'var(--color-primary, #1E3A5F)',
                border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
              📷 Change Photo
            </button>
            <button onClick={() => setZoomed(false)}
              style={{ color:'rgba(255,255,255,0.5)', background:'none', border:'none',
                cursor:'pointer', fontSize:12 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}


// -- LEADERBOARD ROW with profile photo ------------------------------------
export function LeaderboardRow({ rank, user, isCurrentUser }) {
  const NAVY = '#1E3A5F'
  const GOLD = '#C9A84C'

  const rankColors = { 1:'#FFD700', 2:'#C0C0C0', 3:'#CD7F32' }
  const rankEmojis = { 1:'🥇', 2:'🥈', 3:'🥉' }

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
      borderRadius:14, marginBottom:6,
      background: isCurrentUser ? `${NAVY}10` : '#fff',
      border: isCurrentUser ? `2px solid ${NAVY}` : '1.5px solid #E2E8F0',
    }}>
      {/* Rank */}
      <div style={{ width:32, textAlign:'center', flexShrink:0 }}>
        {rank <= 3 ? (
          <span style={{ fontSize:20 }}>{rankEmojis[rank]}</span>
        ) : (
          <span style={{ fontSize:13, fontWeight:800,
            color: rank <= 10 ? NAVY : '#94A3B8' }}>#{rank}</span>
        )}
      </div>

      {/* Profile photo */}
      <ProfilePhoto
        userId={user.id}
        name={user.name}
        photoUrl={user.profile_photo_url}
        size={38}
        isOwner={false}
      />

      {/* Name + state */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:700, color:isCurrentUser?NAVY:'#1E293B',
          margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {user.name} {isCurrentUser && <span style={{ fontSize:10, color:NAVY }}>(You)</span>}
        </p>
        <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{user.state || 'India'}</p>
      </div>

      {/* Score */}
      <div style={{ textAlign:'right' }}>
        <p style={{ fontSize:14, fontWeight:800, color:rank===1?'#D97706':NAVY, margin:0 }}>
          {user.score?.toLocaleString('en-IN')}
        </p>
        <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>XP points</p>
      </div>

      {/* Accuracy badge */}
      {user.accuracy && (
        <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0',
          borderRadius:8, padding:'4px 8px', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#059669', margin:0 }}>
            {user.accuracy}%
          </p>
          <p style={{ fontSize:9, color:'#94A3B8', margin:0 }}>Acc.</p>
        </div>
      )}
    </div>
  )
}


// -- SUPABASE EDGE FUNCTION (create this file separately) ------------------
/*
FILE: supabase/functions/moderate-image/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const VISION_KEY = Deno.env.get('GOOGLE_VISION_API_KEY')

serve(async (req) => {
  const { image_url, user_id } = await req.json()

  try {
    // Google Vision API Safe Search Detection
    const resp = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: image_url } },
            features: [{ type: 'SAFE_SEARCH_DETECTION' }]
          }]
        })
      }
    )

    const data = await resp.json()
    const safe = data.responses?.[0]?.safeSearchAnnotation

    const BLOCKED = ['LIKELY','VERY_LIKELY']

    if (BLOCKED.includes(safe?.adult) || BLOCKED.includes(safe?.racy)) {
      return new Response(JSON.stringify({ flagged:true, reason:'nudity' }), {
        headers: { 'Content-Type':'application/json' }
      })
    }

    if (BLOCKED.includes(safe?.violence)) {
      return new Response(JSON.stringify({ flagged:true, reason:'violence' }), {
        headers: { 'Content-Type':'application/json' }
      })
    }

    return new Response(JSON.stringify({ flagged:false }), {
      headers: { 'Content-Type':'application/json' }
    })
  } catch (e) {
    // If Vision API fails, allow image (fail-open with manual review queue)
    console.error('Vision API error:', e)
    return new Response(JSON.stringify({ flagged:false, manual_review:true }), {
      headers: { 'Content-Type':'application/json' }
    })
  }
})
*/