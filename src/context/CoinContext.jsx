import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getWalletData, earnCoins, spendCoins } from '../lib/coinVault'
import { useAuth } from './AuthContext'

const CoinCtx = createContext({})

export function CoinProvider({ children }) {
  const { user } = useAuth()
  const [balance,  setBalance]  = useState(0)
  const [txs,      setTxs]      = useState([])
  const [recentMsg,setMsg]      = useState(null)  // "+25 coins" popup

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

  return (
    <CoinCtx.Provider value={{ balance, txs, earn, spend, refresh, recentMsg }}>
      {children}
      {/* Toast popup when coins earned/spent */}
      {recentMsg && (
        <div style={{
          position:'fixed', bottom:120, right:20, zIndex:9999,
          background: recentMsg.startsWith('+') ? '#22C55E' : '#EF4444',
          color:'#fff', padding:'8px 18px', borderRadius:20,
          fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
          boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
          animation:'coinPop 0.3s ease',
        }}>
          {recentMsg}
        </div>
      )}
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
