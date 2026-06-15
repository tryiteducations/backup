const DATA = [45,62,58,71,68,78,74,82,79,84]

export default function ScoreTrendWidget() {
  const W = 280, H = 110, px = 16, py = 12
  const iW = W - px * 2, iH = H - py * 2
  const min = Math.min(...DATA), max = Math.max(...DATA), rng = max - min || 1
  const pts = DATA.map((v, i) => ({
    x: px + (i / (DATA.length - 1)) * iW,
    y: py + iH - ((v - min) / rng) * iH,
  }))
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ')
  const last = pts[pts.length - 1]
  const avg = Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length)
  const best = Math.max(...DATA)
  const trend = DATA[DATA.length - 1] - DATA[DATA.length - 2]

  return (
    <div className="clay rounded-3xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg font-poppins">📈 Score Trend</h3>
        <span className="text-xs text-slate-500">Last 30 days</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={px} y1={py + iH * (1 - f)} x2={W - px} y2={py + iH * (1 - f)}
            stroke="var(--color-border, #E2E8F0)" strokeWidth="1" strokeDasharray="4,4" />
        ))}
        <polyline points={poly} fill="none" stroke="var(--color-primary, #1E3A5F)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 2.5}
            fill={i === pts.length - 1 ? 'var(--color-accent, #D4AF37)' : 'var(--color-primary, #1E3A5F)'} />
        ))}
        <text x={last.x} y={last.y - 10} textAnchor="middle" fill="var(--color-accent, #D4AF37)" fontSize="11" fontWeight="bold">
          {DATA[DATA.length - 1]}%
        </text>
      </svg>
      <div className="flex justify-around mt-3 pt-3 border-t border-slate-100">
        {[['Avg', `${avg}%`], ['Best', `${best}%`], ['Trend', `${trend > 0 ? '+' : ''}${trend}%`]].map(([l, v]) => (
          <div key={l} className="text-center">
            <p className="text-lg font-bold text-[var(--color-accent, #D4AF37)] font-poppins">{v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
