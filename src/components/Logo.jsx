/**
 * TryIT Educations — Official Brand Logo Component
 * Hand-traced pure React inline SVG vector.
 * Props:
 *   dark   — boolean (default false) — inverts "TRY" / "EDUCATIONS" text to white
 *   height — number  (default 54)    — controls rendered height; width scales proportionally
 */

export default function Logo({ dark = false, height = 54 }) {
  // The SVG artboard is 520 × 320 (aspect ratio ≈ 1.625)
  const W = 520;
  const H = 320;
  const width = (height * W) / H;

  // Brand colours
  const navy = dark ? "#FFFFFF" : "#1A2E5A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={height}
      role="img"
      aria-label="TryIT Educations"
    >
      {/* ─────────────────────────────────────────────
          DEFS  –  gradients + animation
      ───────────────────────────────────────────── */}
      <defs>

        {/* ── 24K Liquid-Gold shimmer gradient (vertical, for text fills) ── */}
        <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5E27A" />
          <stop offset="14%"  stopColor="var(--color-accent-light, #E8C84A)" />
          <stop offset="28%"  stopColor="#FFFFF0" />   {/* white-hot glare */}
          <stop offset="42%"  stopColor="#D4A017" />
          <stop offset="58%"  stopColor="#C9A84C" />
          <stop offset="72%"  stopColor="#F0D060" />
          <stop offset="84%"  stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* ── Gold shimmer for accent bars (horizontal) ── */}
        <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#8B6914" />
          <stop offset="20%"  stopColor="#C9A84C" />
          <stop offset="40%"  stopColor="#FFFFF0" />
          <stop offset="60%"  stopColor="#D4A017" />
          <stop offset="80%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* ── Arrow radial gloss ── */}
        <linearGradient id="goldArrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%"   stopColor="#8B6914" />
          <stop offset="30%"  stopColor="#C9A84C" />
          <stop offset="55%"  stopColor="#FFFFF0" />
          <stop offset="80%"  stopColor="#D4A017" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>

        {/* ── Sun rays gradient ── */}
        <linearGradient id="goldRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5E27A" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* ── CSS keyframe: arrow soars up-right then softly resets ── */}
        <style>{`
          @keyframes arrowSoar {
            0%   { transform: translate(0px,  0px)  scale(1);    opacity: 1; }
            60%  { transform: translate(7px, -7px)  scale(1.08); opacity: 1; }
            80%  { transform: translate(11px,-11px) scale(1.11); opacity: 0.7; }
            100% { transform: translate(0px,  0px)  scale(1);    opacity: 1; }
          }
          .tryit-arrow {
            animation: arrowSoar 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
            transform-origin: 318px 68px;   /* pivot = base of arrow shaft */
          }
        `}</style>
      </defs>

      {/* ═══════════════════════════════════════════
          RISING SUN  (centre ≈ x:318, y:82)
          Semicircle + 8 rays, all gold
      ═══════════════════════════════════════════ */}

      {/* Sun disc – upper half only */}
      <path
        d="M 292 98 A 26 26 0 0 1 344 98 Z"
        fill="url(#goldV)"
      />
      {/* Sun disc base horizontal bar */}
      <rect x="290" y="96" width="56" height="5" rx="2" fill="url(#goldV)" />

      {/* 8 rays: hand-placed around the semicircle */}
      {/* Top-centre */}
      <rect x="316" y="55" width="5"  height="16" rx="2" fill="url(#goldRay)" />
      {/* Top-left ~-45° */}
      <rect
        x="307" y="57" width="5" height="16" rx="2" fill="url(#goldRay)"
        transform="rotate(-45 309 65)"
      />
      {/* Top-right ~+45° */}
      <rect
        x="325" y="57" width="5" height="16" rx="2" fill="url(#goldRay)"
        transform="rotate(45 327 65)"
      />
      {/* Far-left ~-75° */}
      <rect
        x="295" y="61" width="5" height="15" rx="2" fill="url(#goldRay)"
        transform="rotate(-70 297 68)"
      />
      {/* Far-right ~+75° */}
      <rect
        x="338" y="61" width="5" height="15" rx="2" fill="url(#goldRay)"
        transform="rotate(70 340 68)"
      />
      {/* Far-left ~-90° (horizontal ray left) */}
      <rect x="274" y="78" width="14" height="5" rx="2" fill="url(#goldRay)" />
      {/* Far-right ~+90° (horizontal ray right) */}
      <rect x="350" y="78" width="14" height="5" rx="2" fill="url(#goldRay)" />
      {/* Extra left-mid */}
      <rect
        x="283" y="66" width="5" height="14" rx="2" fill="url(#goldRay)"
        transform="rotate(-57 285 72)"
      />

      {/* ═══════════════════════════════════════════
          GROWTH ARROW  (animated, top-right of sun)
          Diagonal shaft + arrowhead pointing NE
      ═══════════════════════════════════════════ */}
      <g className="tryit-arrow">
        {/* Arrow shaft – diagonal line rendered as a thick rotated rect */}
        <line
          x1="341" y1="89"
          x2="374" y2="53"
          stroke="url(#goldArrow)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        {/* Arrowhead – filled triangle pointing NE */}
        <polygon
          points="374,40  387,56  360,52"
          fill="url(#goldArrow)"
        />
      </g>

      {/* ═══════════════════════════════════════════
          MAIN WORDMARK  "TRY IT"
          Baseline y ≈ 185
          "TRY" navy, "IT" gold
          Using heavyweight geometric letterforms
          hand-drawn as <text> with tight tracking
      ═══════════════════════════════════════════ */}

      {/*
        We use SVG <text> with font-weight 900 for max fidelity.
        The font stack falls back gracefully everywhere.
        "TRY" ends around x:272; "IT" starts at x:278 (slight kern gap).
      */}

      {/* TRY */}
      <text
        x="30"
        y="190"
        fontFamily="'Arial Black', 'Franklin Gothic Heavy', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="130"
        letterSpacing="-3"
        fill={navy}
        dominantBaseline="auto"
      >
        TRY
      </text>

      {/* IT  – gold gradient */}
      <text
        x="283"
        y="190"
        fontFamily="'Arial Black', 'Franklin Gothic Heavy', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="130"
        letterSpacing="-2"
        fill="url(#goldV)"
        dominantBaseline="auto"
      >
        IT
      </text>

      {/* ═══════════════════════════════════════════
          GOLD ACCENT BARS
          Two horizontal bars flanking "EDUCATIONS"
      ═══════════════════════════════════════════ */}
      {/* Top bar */}
      <rect x="28" y="200" width="466" height="5" rx="2" fill="url(#goldH)" />
      {/* Bottom bar */}
      <rect x="28" y="277" width="466" height="5" rx="2" fill="url(#goldH)" />

      {/* ═══════════════════════════════════════════
          "EDUCATIONS"  subtitle text
          Centred between the two gold bars
      ═══════════════════════════════════════════ */}
      <text
        x="261"
        y="268"
        fontFamily="'Arial Black', 'Franklin Gothic Heavy', 'Impact', sans-serif"
        fontWeight="900"
        fontSize="52"
        letterSpacing="6"
        fill={navy}
        textAnchor="middle"
        dominantBaseline="auto"
      >
        EDUCATIONS
      </text>

    </svg>
  );
}
