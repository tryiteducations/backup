// src/lib/shareImage.js
// Reusable branded share-image generator. Any page can call
// shareProgress({ theme, name, headline, stat, subLabel, context, emoji })
// to generate a Canvas image and trigger the native share sheet, without
// each page needing to duplicate the Canvas drawing code.

export async function shareProgress({
  theme, name = 'Student', headline, stat, subLabel, context = 'TryIT Educations', emoji = '🎓',
}) {
  const p = theme?.primary || '#1E3A5F'
  const primD = theme?.primaryDark || '#0F2140'
  const accent = theme?.accent || '#C9A84C'

  const text = `${headline} - ${stat} on TryIT Educations! ${emoji} tryiteducations.net`

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1080
    const ctx = canvas.getContext('2d')

    const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
    grad.addColorStop(0, p); grad.addColorStop(1, primD)
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080)

    const glow = ctx.createRadialGradient(860, 220, 20, 860, 220, 400)
    glow.addColorStop(0, `${accent}55`); glow.addColorStop(1, `${accent}00`)
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080)

    ctx.fillStyle = '#fff'; ctx.font = 'bold 46px Poppins, sans-serif'
    ctx.fillText('TryIT Educations', 70, 110)
    ctx.fillStyle = accent; ctx.fillRect(70, 130, 90, 6)

    ctx.beginPath(); ctx.arc(150, 300, 70, 0, Math.PI * 2)
    ctx.fillStyle = accent; ctx.fill()
    ctx.fillStyle = primD; ctx.font = 'bold 60px Poppins, sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText((name[0] || 'S').toUpperCase(), 150, 305)
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = '#fff'; ctx.font = 'bold 38px Poppins, sans-serif'
    ctx.fillText(name, 250, 285)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '24px Inter, sans-serif'
    ctx.fillText(context, 250, 325)

    // Wrap headline if long
    ctx.fillStyle = accent; ctx.font = 'bold 42px Poppins, sans-serif'
    wrapText(ctx, headline, 70, 470, 940, 52)

    ctx.fillStyle = accent; ctx.font = 'bold 100px Poppins, sans-serif'
    ctx.fillText(stat, 70, 660)
    if (subLabel) {
      ctx.fillStyle = '#fff'; ctx.font = '32px Inter, sans-serif'
      ctx.fillText(subLabel, 70, 710)
    }

    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '28px Inter, sans-serif'
    ctx.fillText('tryiteducations.net · Your Exam. Your Rank. Your Success.', 70, 1010)

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) {
      if (navigator.share) navigator.share({ title: headline, text })
      return
    }
    const file = new File([blob], 'tryit-share.png', { type: 'image/png' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: headline, text, files: [file] })
    } else if (navigator.share) {
      await navigator.share({ title: headline, text })
    } else {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob); link.download = 'tryit-share.png'
      link.click()
    }
  } catch (e) {
    console.error('Share image generation failed:', e)
    if (navigator.share) navigator.share({ title: headline, text })
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, curY)
      line = word + ' '
      curY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, curY)
}
