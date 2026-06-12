import { createContext, useContext, useState, useEffect } from 'react'
import { applyTheme, getTheme, THEMES } from '../lib/themes'

const ThemeCtx = createContext({})

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem('tryit_theme') || 'default'
  )

  useEffect(() => {
    applyTheme(themeId)
  }, [themeId])

  const setTheme = (id) => {
    setThemeId(id)
    applyTheme(id)
  }

  return (
    <ThemeCtx.Provider value={{ themeId, theme: getTheme(themeId), setTheme, themes: THEMES }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
