// src/components/AvatarUpload.jsx
import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Loader2, X, Check } from 'lucide-react'
import { checkImageSafety, MODERATION_MESSAGES } from '../lib/avatarModeration'
// Adjust this import to match wherever your Supabase client lives.
import { supabase } from '../lib/supabaseClient'

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB raw upload ceiling
const OUTPUT_SIZE = 480 // final square avatar dimension in px

/**
 * Compresses + center-crops an image file to a square JPEG blob,
 * entirely client-side via canvas — so a phone camera's 8MB photo
 * doesn't get pushed to storage as-is. This runs before moderation
 * and before upload.
 */
function compressToSquare(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = (e) => { img.src = e.target.result }
    reader.onerror = reject
    img.onload = () => {
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('compression_failed'))),
        'image/jpeg',
        0.86
      )
    }
    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * userId: used to build the storage path avatars/{userId}.jpg
 * onUploaded(publicUrl): called once the photo is stored, moderated,
 * and the profile row is ready to be updated by the caller.
 */
export default function AvatarUpload({ userId, currentUrl, onUploaded }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle') // idle | compressing | moderating | uploading | done | error
  const [errorMsg, setErrorMsg] = useState(null)

  const reset = useCallback(() => {
    setPreview(null)
    setStatus('idle')
    setErrorMsg(null)
  }, [])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setErrorMsg(null)

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg(MODERATION_MESSAGES.invalid_type)
      setStatus('error')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorMsg(MODERATION_MESSAGES.too_large)
      setStatus('error')
      return
    }

    try {
      setStatus('compressing')
      const blob = await compressToSquare(file)
      setPreview(URL.createObjectURL(blob))

      setStatus('moderating')
      const { safe, reason } = await checkImageSafety(blob)
      if (!safe) {
        setErrorMsg(MODERATION_MESSAGES[reason] || MODERATION_MESSAGES.inappropriate_content)
        setStatus('error')
        return
      }

      setStatus('uploading')
      const path = `avatars/${userId}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      // Cache-bust so the new photo shows immediately, not the stale CDN copy.
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

      setStatus('done')
      onUploaded?.(publicUrl)
    } catch (err) {
      setErrorMsg('Something went wrong uploading your photo. Please try again.')
      setStatus('error')
    }
  }, [userId, onUploaded])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div
          style={{
            width: 120, height: 120, borderRadius: '50%', overflow: 'hidden',
            background: preview || currentUrl
              ? `url(${preview || currentUrl}) center/cover no-repeat`
              : 'var(--color-bg, #F1F5F9)',
            border: '3px solid var(--color-accent, #D4AF37)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {!preview && !currentUrl && <Camera size={32} color="var(--subtext-color, #94A3B8)" />}
        </div>

        <AnimatePresence>
          {(status === 'compressing' || status === 'moderating' || status === 'uploading') && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(15,23,42,0.55)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Loader2 size={26} color="#FFFFFF" className="animate-spin-slow" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => inputRef.current?.click()}
          disabled={status === 'compressing' || status === 'moderating' || status === 'uploading'}
          style={{
            position: 'absolute', bottom: -2, right: -2, width: 36, height: 36,
            borderRadius: '50%', background: 'var(--color-accent, #D4AF37)',
            border: '2px solid var(--color-surface, #FFFFFF)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Camera size={16} color="var(--color-primary-dark, #1E3A5F)" />
        </motion.button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {status === 'moderating' && (
        <p style={{ fontSize: 12, color: 'var(--subtext-color, #64748B)' }}>Checking your photo…</p>
      )}
      {status === 'uploading' && (
        <p style={{ fontSize: 12, color: 'var(--subtext-color, #64748B)' }}>Uploading…</p>
      )}
      {status === 'done' && (
        <p style={{ fontSize: 12, color: 'var(--color-success, #22C55E)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Check size={14} /> Profile photo updated
        </p>
      )}
      {status === 'error' && errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, maxWidth: 240, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--color-error, #EF4444)' }}>{errorMsg}</p>
          <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={14} color="var(--subtext-color, #94A3B8)" />
          </button>
        </div>
      )}
    </div>
  )
}