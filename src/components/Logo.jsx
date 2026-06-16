// src/components/Logo.jsx
export default function Logo({ dark = false, height = 54 }) {
  const trySize = Math.round(height * 0.55)
  const eduSize = Math.round(height * 0.22)
  const gap     = Math.round(height * 0.06)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', gap, lineHeight: 1,
      userSelect: 'none',
    }}>
      {/* TryIT — no gap between Try and IT */}
      <div style={{ display:'flex', alignItems:'baseline', gap: 0 }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: trySize,
          letterSpacing: -1,
          lineHeight: 1,
          color: 'var(--color-accent, #D4AF37)',
        }}>Try</span>
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: trySize,
          letterSpacing: -1,
          lineHeight: 1,
          color: 'var(--color-logo-it, var(--color-primary, #1E3A5F))',
        }}>IT</span>
      </div>

      {/* Educations */}
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: eduSize,
        letterSpacing: 2.5,
        lineHeight: 1,
        textTransform: 'uppercase',
        color: 'var(--color-accent, #D4AF37)',
        opacity: 0.85,
      }}>Educations</div>
    </div>
  )
}