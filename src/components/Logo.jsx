import { useState } from 'react'
import LogoAnimated from './LogoAnimated'

export default function Logo({
  height = 44, dark = false,
  animated = false, loop = false,
  size = 'md', onComplete,
}) {
  const [imgError, setImgError] = useState(false)

  if (animated || imgError) {
    return (
      <LogoAnimated
        size={size}
        mode={loop ? 'loop' : animated ? 'auto' : 'static'}
        dark={dark}
        onComplete={onComplete}
      />
    )
  }

  return (
    <img
      src="/tryit-logo.webp"
      alt="TryIT Educations"
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
      onError={() => setImgError(true)}
    />
  )
}
