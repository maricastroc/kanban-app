import React, { createContext, useContext, useState } from 'react'

type ThemeContextType = {
  enableDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enableDarkMode, setEnableDarkMode] = useState(true)

  const toggleTheme = () => {
    setEnableDarkMode((prev) => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'DARK_THEME' : 'LIGHT_THEME')
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ enableDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }
