import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global Twemoji enhancer.
 * Automatically parses all emoji in document.body into Twemoji images
 * after initial load and after every route change.
 *
 * Usage: call useTwemoji() once in your root App component.
 */
export default function useTwemoji() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const twemoji = window.twemoji
    if (!twemoji || typeof twemoji.parse !== 'function') return

    try {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
        // override twemoji's internal default base (the now-defunct maxcdn) with a working CDN
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
        className: 'twemoji',
      })
    } catch (err) {
      // best-effort enhancement; fail silently if parsing fails
    }
    // re-run on every pathname+search change to catch newly-rendered emoji
  }, [location.pathname, location.search])
}
