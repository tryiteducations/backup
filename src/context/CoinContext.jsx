// src/context/CoinContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWalletData, earnCoins, spendCoins } from '../lib/coinVault'
import { useAuth } from './AuthContext'

const CoinCtx = createContext({})

export function CoinProvider({ children }) {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [txs, setTxs] = useState([])
  const [recentMsg, setMsg] = useState(null) // "+25 coins" popup
  const [unlockCelebration, setUnlockCelebration] = useState(null) // theme unlock toast

  const refresh = useCallback(() => {
    const { balance, transactions } = getWalletData()
    setBalance(balance)
    setTxs(transactions)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const earn = useCallback(async (params) => {
    const result = await earnCoins({ ...params, userId: user?.id })
    refresh()
    setMsg(`+${params.amount} 🪙`)
    setTimeout(() => setMsg(null), 2000)
    return result
  }, [user?.id, refresh])

  const spend = useCallback(async (params) => {
    const result = await spendCoins({ ...params, userId: user?.id })
    if (result.success) { refresh(); setMsg(`-${params.amount} 🪙`) }
    setTimeout(() => setMsg(null), 2000)
    return result
  }, [user?.id, refresh])

  /**
   * Call this from ThemeProvider's onThemeUnlocked callback (wire it
   * in App.jsx, e.g. <ThemeProvider onThemeUnlocked={celebrateThemeUnlock} ...>)
   * to fire the reward-moment animation. This is intentionally a
   * bigger, slower, more deliberate celebration than the coin toast —
   * unlocking a theme is a milestone, not a routine transaction, and
   * the visual weight should reflect that difference.
   */
  const celebrateThemeUnlock = useCallback((theme) => {
    setUnlockCelebration(theme)
    setTimeout(() => setUnlockCelebration(null), 3400)
  }, [])

  return (
    <CoinCtx.Provider value={{ balance, txs, earn, spend, refresh, recentMsg, celebrateThemeUnlock }}>
      {children}

      {/* Routine coin earn/spend toast — small, quick, frequent */}
      {recentMsg && (
        <div style={{
          position: 'fixed', bottom: 120, right: 20, zIndex: 9999,
          background: recentMsg.startsWith('+') ? 'var(--color-success, #22C55E)' : 'var(--color-error, #EF4444)',
          color: '#fff', padding: '8px 18px', borderRadius: 20,
          fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'coinPop 0.3s ease',
        }}>
          {recentMsg}
        </div>
      )}

      {/* Theme unlock celebration — rare, deliberate, weighty. Kept
          separate from the coin toast on purpose: if every event used
          the same visual treatment, milestones would stop feeling
          different from routine actions. */}
      <AnimatePresence>
        {unlockCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                position: 'relative',
                background: unlockCelebration.idCardBg || 'linear-gradient(135deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))',
                borderRadius: 28, padding: '36px 32px', textAlign: 'center',
                maxWidth: 320, boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
                border: `1px solid ${unlockCelebration.idCardBorder || 'rgba(212,175,55,0.4)'}`,
              }}
            >
              {/* Expanding ring burst behind the emoji, runs once */}
              <span style={{
                position: 'absolute', top: 36, left: '50%', width: 70, height: 70,
                marginLeft: -35, borderRadius: '50%',
                border: `2px solid ${unlockCelebration.accent || '#D4AF37'}`,
                animation: 'ringExpand 1s ease-out',
              }} />

              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                style={{ fontSize: 56, marginBottom: 12, position: 'relative' }}
              >
                {unlockCelebration.emoji || '🎉'}
              </motion.div>

              <p style={{
                color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700,
                letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
              }}>
                New Theme Unlocked
              </p>
              <p style={{
                color: unlockCelebration.idCardId || '#FFFFFF', fontSize: 22, fontWeight: 800,
                fontFamily: 'Poppins,sans-serif', marginBottom: 16,
              }}>
                {unlockCelebration.name}
              </p>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {[unlockCelebration.primary, unlockCelebration.accent, unlockCelebration.bg].filter(Boolean).map((c, i) => (
                  <span key={i} style={{ width: 24, height: 24, borderRadius: 8, background: c, border: '1px solid rgba(255,255,255,0.2)' }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes coinPop {
          from { transform: scale(0.8) translateY(20px); opacity:0; }
          to   { transform: scale(1) translateY(0); opacity:1; }
        }
      `}</style>
    </CoinCtx.Provider>
  )
}

export const useCoins = () => useContext(CoinCtx)