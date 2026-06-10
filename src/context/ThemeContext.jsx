import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({})

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(
    () => localStorage.getItem('tryit_theme') || 'classic-navy'
  )
  useEffect(() => {
    localStorage.setItem('tryit_theme', activeTheme)
  }, [activeTheme])
  return (
    <ThemeCtx.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
