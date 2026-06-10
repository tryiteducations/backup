import { createContext, useContext, useState, useCallback } from 'react'

export const LanguageContext = createContext({
  langTone: 'en', setLangTone: () => {},
})

const LANG_STORAGE_KEY = 'app_lang_tone'

export function LanguageProvider({ children }) {
  const [langTone, setLangToneRaw] = useState(
    () => localStorage.getItem(LANG_STORAGE_KEY) || 'en'
  )
  const setLangTone = useCallback((val) => {
    setLangToneRaw(val)
    localStorage.setItem(LANG_STORAGE_KEY, val)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { langTone: val } }))
  }, [])
  return (
    <LanguageContext.Provider value={{ langTone, setLangTone }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
