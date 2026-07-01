// src/components/OwnProfileAvatar.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { getAvatarDecoration } from '../lib/avatarBadges'

/**
 * Use this ONLY on a user's own profile page, viewed by themselves.
 * Same photo, same ring/badge decoration as ProtectedAvatar - but
 * tappable, opening a full-screen zoomable preview. This asymmetry
 * is intentional: only the account owner gets full access to their
 * own image; everyone else sees the protected, non-zoomable version.
 */
export default function OwnProfileAvatar({ user, size = 96 }) {
  const [open, setOpen] = useState(false)
  const { ring, badge } = getAvatarDecoration(user)
  const photoUrl = user?.avatarUrl

  return (
    <>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => photoUrl && setOpen(true)}
          style={{
            width: size, height: size, borderRadius: '50%',
            background: photoUrl
              ? `url(${photoUrl}) center/cover no-repeat`
              : 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
            border: `${Math.max(2, Math.round(size * 0.045))}px solid ${ring.color}`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.5), 0 6px 18px ${ring.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: photoUrl ? 'pointer' : 'default',
          }}
        >
          {!photoUrl && (
            <span style={{ color: 'var(--color-surface, #FFFFFF)', fontWeight: 800, fontSize: size * 0.36, fontFamily: 'Poppins, sans-serif' }}>
              {user?.initials || '?'}
            </span>
          )}
        </motion.button>

        {badge && (
          <span
            title={badge.tooltip}
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: Math.max(20, size * 0.3), height: Math.max(20, size * 0.3),
              borderRadius: '50%', background: 'var(--color-surface, #FFFFFF)',
              border: `1.5px solid ${badge.glow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: size * 0.18,
              boxShadow: `0 2px 8px ${badge.glow}55`,
            }}
          >
            {badge.icon}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && photoUrl && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(0,0,0,0.88)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
          >
            <motion.img
              src={photoUrl}
              alt="Your profile photo"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{
                maxWidth: '92vw', maxHeight: '80vh', borderRadius: 20,
                border: `3px solid ${ring.color}`, objectFit: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: 24, right: 24, width: 40, height: 40,
                borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} color="#FFFFFF" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}