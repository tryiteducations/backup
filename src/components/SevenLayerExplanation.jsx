import { useState, useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

const LAYERS = [
  { key: 'simple_answer',       icon: '💡', label: 'Simple Answer'       },
  { key: 'deep_concept',        icon: '🧠', label: 'Deep Concept'        },
  { key: 'wrong_option_autopsy',icon: '🔍', label: 'Why Others Are Wrong' },
  { key: 'memory_trick',        icon: '🎯', label: 'Memory Trick'        },
  { key: 'cultural_story',      icon: '📖', label: 'Story / Context'     },
  { key: 'exam_tip',            icon: '⚡', label: 'Exam Strategy Tip'   },
  { key: 'pyq_relevance',       icon: '📅', label: 'PYQ Relevance'       },
]

export default function SevenLayerExplanation({ question, isCorrect }) {
  const { langTone } = useContext(LanguageContext)
  const [expanded, setExpanded]   = useState(false)
  const [openLayer, setOpenLayer] = useState(null)

  // Pick explanation object for current language, fallback to English
  const expl =
    question.explanations?.[langTone] ||
    question.explanations?.['en'] ||
    {}

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: expanded
            ? 'linear-gradient(135deg,#1E3A5F,#0F2140)'
            : 'rgba(30,58,95,0.08)',
          border: '1.5px solid rgba(30,58,95,0.2)',
          borderRadius: 12, padding: '10px 16px',
          cursor: 'pointer', width: '100%',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          fontFamily: 'Poppins,sans-serif', fontWeight: 700,
          fontSize: 13, color: expanded ? '#D4AF37' : '#1E3A5F',
        }}>
          📚 Show 7-Layer Explanation
        </span>
        <span style={{ color: expanded ? '#D4AF37' : '#1E3A5F', fontSize: 16 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8, border: '1.5px solid rgba(30,58,95,0.15)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              {LAYERS.map((layer, i) => (
                <div key={layer.key}>
                  <button
                    onClick={() => setOpenLayer(openLayer === layer.key ? null : layer.key)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '12px 16px',
                      background: openLayer === layer.key
                        ? 'rgba(212,175,55,0.1)'
                        : i % 2 === 0 ? '#FAFBFC' : '#FFFFFF',
                      border: 'none', borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600,
                      fontSize: 13, color: '#1E3A5F' }}>
                      {layer.icon} {layer.label}
                    </span>
                    <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 14 }}>
                      {openLayer === layer.key ? '▲' : '▼'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openLayer === layer.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '14px 18px',
                          background: 'rgba(212,175,55,0.05)',
                          fontFamily: 'Inter,sans-serif', fontSize: 14,
                          color: '#334155', lineHeight: 1.7,
                          borderBottom: '1px solid #F1F5F9',
                          whiteSpace: 'pre-line',
                        }}>
                          {expl[layer.key] || 'Explanation not available in this language yet.'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
