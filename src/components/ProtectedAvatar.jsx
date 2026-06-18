// src/components/ProtectedAvatar.jsx
import { getAvatarDecoration } from '../lib/avatarBadges'

/**
 * Use this EVERYWHERE a photo is shown that ISN'T the owner viewing
 * their own profile: leaderboards, mentor hub, doubt threads, The
 * Hall, anywhere another user sees this person's avatar.
 *
 * Protection approach (read this before changing it):
 * - Rendered as a div with background-image, NOT an <img> tag. This
 *   defeats the most common "save image" / drag-out-to-desktop flows
 *   that target <img> elements specifically.
 * - oncontextmenu disabled — no long-press / right-click "save image".
 * - draggable=false + onDragStart prevented — can't drag the element
 *   out to the desktop or another app.
 * - -webkit-touch-callout: none — disables the iOS long-press menu.
 * - user-select: none — prevents some assistive "copy image" flows.
 * - Pinch-zoom is prevented by NOT making this element interactive —
 *   no onClick, no modal, nothing to tap into. A static image with no
 *   affordance to enlarge stays small, so even a screenshot only
 *   captures a small, blurry-when-enlarged photo — the real backstop.
 *
 * None of this stops OS-level screenshots (nothing can — see the
 * conversation that led to this component). What it stops is the
 * *next* easiest path: an effortless full-resolution save or zoom.
 */
export default function ProtectedAvatar({ user, size = 48, showBadge = true }) {
  const { ring, badge } = getAvatarDecoration(user)
  const photoUrl = user?.avatarUrl

  const handleContextMenu = (e) => e.preventDefault()
  const handleDragStart = (e) => e.preventDefault()

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <div
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        draggable={false}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: photoUrl
            ? `url(${photoUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))',
          border: `${Math.max(2, Math.round(size * 0.045))}px solid ${ring.color}`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.5), 0 4px 12px ${ring.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          pointerEvents: 'none', // no tap target at all — nothing to enlarge into
        }}
      >
        {!photoUrl && (
          <span style={{
            color: '#FFFFFF', fontWeight: 800, fontSize: size * 0.36,
            fontFamily: 'Poppins, sans-serif', pointerEvents: 'none',
          }}>
            {user?.initials || '?'}
          </span>
        )}
      </div>

      {showBadge && badge && (
        <span
          title={badge.tooltip}
          style={{
            position: 'absolute', bottom: -2, right: -2,
            width: Math.max(16, size * 0.34), height: Math.max(16, size * 0.34),
            borderRadius: '50%', background: 'var(--color-surface, #FFFFFF)',
            border: `1.5px solid ${badge.glow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.2,
            boxShadow: `0 2px 8px ${badge.glow}55`,
          }}
        >
          {badge.icon}
        </span>
      )}
    </div>
  )
}