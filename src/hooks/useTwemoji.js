import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global Twemoji enhancer.
 * Parses all emoji in document.body into Twemoji images on load, on every
 * route change, and whenever new content is added to the DOM (e.g. a
 * lazy-loaded page component finishing its render after the route already
 * changed). Also retries if window.twemoji isn't ready yet on first check,
 * instead of permanently giving up until the next navigation.
 *
 * Usage: call useTwemoji() once in your root App component.
 */
export default function useTwemoji() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const parseOptions = {
      folder: 'svg',
      ext: '.svg',
      // override twemoji's internal default base (the now-defunct maxcdn) with a working CDN
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
      className: 'twemoji',
    }

    const runParse = () => {
      const twemoji = window.twemoji
      if (!twemoji || typeof twemoji.parse !== 'function') return false
      try {
        twemoji.parse(document.body, parseOptions)
      } catch (err) {
        // best-effort enhancement; fail silently if parsing fails
      }
      return true
    }

    let observer
    let pollTimer
    let debounceTimer

    const startObserving = () => {
      // catch lazy-loaded pages AND later re-renders (e.g. async data like
      // momentum/streak info arriving after mount, filter-tab clicks, etc.)
      // finishing AFTER the initial parse - keep watching for the component's
      // full lifetime instead of an arbitrary short timeout, since some pages
      // (like Games Hub) have several separate async updates after mount.
      // Debounced so rapid/successive mutations (including Twemoji's own
      // <img> insertions) don't trigger constant re-parsing.
      observer = new MutationObserver(() => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(runParse, 150)
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }

    // Try immediately - if window.twemoji is already loaded, this succeeds right away
    const succeeded = runParse()

    if (succeeded) {
      startObserving()
    } else {
      // window.twemoji isn't ready yet (script still loading) - retry every 200ms
      // for up to 5 seconds instead of permanently giving up
      let attempts = 0
      pollTimer = setInterval(() => {
        attempts += 1
        if (runParse() || attempts >= 25) {
          clearInterval(pollTimer)
          startObserving()
        }
      }, 200)
    }

    return () => {
      if (observer) observer.disconnect()
      if (pollTimer) clearInterval(pollTimer)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
    // re-run this whole setup on every route change
  }, [location.pathname, location.search])
}
