import { createContext, useContext, useState, useEffect } from 'react'
import { FREE_TIERS, getTierDiscount } from '../lib/equityTiers'

const EquityCtx = createContext({
  equityTier: null, setEquityTier: () => {},
  verificationStatus: null,
  discount: 0,
  isFreeForLife: false,
})

const STORAGE_KEY  = 'tryit_equity_tier'
const STATUS_KEY   = 'tryit_equity_status'

export function EquityTierProvider({ children }) {
  const [equityTier, setTierRaw]           = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  )
  const [verificationStatus, setStatus] = useState(
    () => localStorage.getItem(STATUS_KEY) || null
  )

  const setEquityTier = (tierId, status = 'pending') => {
    setTierRaw(tierId)
    setStatus(status)
    if (tierId) {
      localStorage.setItem(STORAGE_KEY, tierId)
      localStorage.setItem(STATUS_KEY, status)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STATUS_KEY)
    }
  }

  const discount     = equityTier ? getTierDiscount(equityTier) : 0
  const isFreeForLife = equityTier ? FREE_TIERS.includes(equityTier) : false

  return (
    <EquityCtx.Provider value={{ equityTier, setEquityTier, verificationStatus, discount, isFreeForLife }}>
      {children}
    </EquityCtx.Provider>
  )
}

export const useEquity = () => useContext(EquityCtx)
