import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      type="button"
      className="simple-btn"
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <BiSun /> : <BiMoon />}
    </button>
  )
}
