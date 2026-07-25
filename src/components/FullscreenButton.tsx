import { useEffect, useState } from 'react'
import { CompressIcon, ExpandIcon } from './icons'

/** Vendor-prefixed fullscreen members not present in the standard DOM types. */
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

function fullscreenElement(): Element | null {
  const d = document as FsDocument
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

/**
 * Toggles native browser fullscreen (hides tabs, address bar, OS status bar)
 * via the Fullscreen API. Renders nothing on browsers without support.
 */
export function FullscreenButton() {
  const [supported] = useState(
    () =>
      typeof document !== 'undefined' &&
      (typeof document.documentElement.requestFullscreen === 'function' ||
        typeof (document.documentElement as FsElement).webkitRequestFullscreen === 'function'),
  )
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(fullscreenElement()))
    onChange()
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  async function toggle() {
    try {
      if (fullscreenElement()) {
        const d = document as FsDocument
        await (document.exitFullscreen?.() ?? d.webkitExitFullscreen?.())
      } else {
        const el = document.documentElement as FsElement
        await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())
      }
    } catch {
      /* Fullscreen can be blocked (needs a user gesture or is disallowed) — ignore. */
    }
  }

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFullscreen ? 'Avslutt fullskjerm' : 'Åpne fullskjerm'}
      title={isFullscreen ? 'Avslutt fullskjerm' : 'Fullskjerm'}
      className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-full border border-gold/40 bg-board-deep/80 px-3 py-2 text-sm font-semibold text-cream shadow-lg backdrop-blur-sm transition hover:border-accent hover:text-accent sm:top-4 sm:right-4"
    >
      {isFullscreen ? <CompressIcon className="size-5" /> : <ExpandIcon className="size-5" />}
      <span className="hidden sm:inline">{isFullscreen ? 'Avslutt' : 'Fullskjerm'}</span>
    </button>
  )
}
