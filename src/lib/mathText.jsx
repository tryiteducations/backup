// src/lib/mathText.js
// Lightweight renderer for the limited LaTeX-like patterns that actually
// show up in generated question text (repeating decimals, fractions,
// exponents, subscripts) — NOT a full LaTeX engine. The real app needs
// a proper KaTeX/MathJax integration eventually (this was flagged
// separately as a launch-blocking gap), but this covers the showcase
// page without adding a new npm dependency or requiring a local
// `npm install` before you can demo this to people today.
//
// Supports: \overline{...}, \frac{a}{b}, ^{...} (superscript), _{...}
// (subscript). Anything else passes through as plain text.

import React from 'react'

export function renderMathText(text) {
  if (!text) return text

  const parts = []
  let remaining = text
  let key = 0

  const patterns = [
    { re: /\\overline\{([^}]*)\}/, render: (m) => <span key={key++} style={{ textDecoration: 'overline' }}>{m[1]}</span> },
    { re: /\\frac\{([^}]*)\}\{([^}]*)\}/, render: (m) => (
      <span key={key++} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 2px', fontSize: '0.9em', lineHeight: 1.1 }}>
        <span style={{ borderBottom: '1.5px solid currentColor', padding: '0 3px' }}>{m[1]}</span>
        <span style={{ padding: '0 3px' }}>{m[2]}</span>
      </span>
    ) },
    { re: /\^\{([^}]*)\}/, render: (m) => <sup key={key++}>{m[1]}</sup> },
    { re: /_\{([^}]*)\}/, render: (m) => <sub key={key++}>{m[1]}</sub> },
  ]

  while (remaining.length > 0) {
    let earliestMatch = null
    let earliestPattern = null

    for (const p of patterns) {
      const m = remaining.match(p.re)
      if (m && (earliestMatch === null || m.index < earliestMatch.index)) {
        earliestMatch = m
        earliestPattern = p
      }
    }

    if (!earliestMatch) {
      parts.push(remaining)
      break
    }

    if (earliestMatch.index > 0) {
      parts.push(remaining.slice(0, earliestMatch.index))
    }
    parts.push(earliestPattern.render(earliestMatch))
    remaining = remaining.slice(earliestMatch.index + earliestMatch[0].length)
  }

  return parts
}
