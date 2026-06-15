import { useRef } from 'react'

const STYLE_ID = '__glitter_click_styles__'

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    @keyframes glitterBurst {
      0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
    .glitter-burst {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--color-accent-light, #E8C84A) 0%, var(--color-accent, #D4AF37) 40%, #FFF7A1 70%, transparent 100%);
      animation: glitterBurst 350ms ease-out forwards;
    }
  `
  document.head.appendChild(style)
}

export default function GlitterClick({ children }) {
  const containerRef = useRef(null)

  function handleClick(e) {
    injectStyles()

    const burst = document.createElement('div')
    burst.className = 'glitter-burst'
    burst.style.left = `${e.clientX}px`
    burst.style.top = `${e.clientY}px`
    document.body.appendChild(burst)

    setTimeout(() => {
      burst.remove()
    }, 350)
  }

  return (
    <div ref={containerRef} className="relative inline-flex" onClick={handleClick}>
      {children}
    </div>
  )
}
