import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function ThemeProvider({
  children,
  className,
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (event: any) => {
      if (event.matches) {
        setIsDarkMode(true)
        ref.current.classList.add('dark')
      } else {
        setIsDarkMode(false)
        ref.current.classList.remove('dark')
      }
    }

    if (prefersDarkScheme.matches) {
      setIsDarkMode(true)
      ref.current.classList.add('dark')
    }

    prefersDarkScheme.addEventListener('change', handleSystemThemeChange)

    return () => {
      prefersDarkScheme.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode)
  //   document.documentElement.classList.toggle('dark')
  //   localStorage.setItem('darkMode', isDarkMode ? 'light' : 'dark')
  // }

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode')
    if (storedTheme === 'dark') {
      setIsDarkMode(true)
      ref.current.classList.add('dark')
    }
  }, [])

  return (
    <div
      ref={ref}
      id="penx-theme"
      className={cn(
        'bg-background text-foreground font-sans',
        isDarkMode && 'dark',
        className,
      )}
    >
      {children}
    </div>
  )
}
