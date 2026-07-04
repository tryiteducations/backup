import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global Twemoji enhancer.
 * Parses all emoji in document.body into Twemoji images on load, on every
 * route change, AND whenever new content is added to the DOM (e.g. a
 * lazy-loaded page component finishing its render after the route already
 * changed) - a plain location-based effect alone misses this race condition.
 *
 * Usage: call useTwemoji() once in your root App component.
 */
export default function useTwemoji() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const twemoji = window.twemoji
    if (!twemoji || typeof twemoji.parse !== 'function') return

    const parseOptions = {
      folder: 'svg',
      ext: '.svg',
      // override twemoji's internal default base (the now-defunct maxcdn) with a working CDN
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
      className: 'twemoji',
    }

    const runParse = () => {
      try {
        twemoji.parse(document.body, parseOptions)
      } catch (err) {
        // best-effort enhancement; fail silently if parsing fails
      }
    }

    // initial parse for whatever's already rendered
    runParse()

    // catch lazy-loaded pages finishing their render AFTER the route change
    // (Suspense resolving a lazy() import is not synchronous with navigation)
    const observer = new MutationObserver(() => {
      runParse()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // stop observing after a few seconds - by then any lazy chunk has loaded,
    // and we don't want to keep re-parsing on every minor state update forever
    const stopTimer = setTimeout(() => observer.disconnect(), 3000)

    return () => {
      observer.disconnect()
      clearTimeout(stopTimer)
    }
    // re-run this whole setup on every route change
  }, [location.pathname, location.search])
}
