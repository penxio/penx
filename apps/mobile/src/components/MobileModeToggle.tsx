'use client'

import * as React from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@penx/uikit/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@penx/uikit/dropdown-menu'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  variant?:
    | 'default'
    | 'brand'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'outline-solid'
}
export function MobileModeToggle({ className, variant = 'ghost' }: Props) {
  async function setLight() {
    const html = document.documentElement
    html.classList.remove('dark')
    html.classList.remove('ion-palette-dark')

    await StatusBar.setStyle({
      style: Style.Light,
    })
  }

  async function setDark() {
    const html = document.documentElement
    html.classList.add('dark')
    html.classList.add('ion-palette-dark')
    await StatusBar.setStyle({
      style: Style.Dark,
    })
  }

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    const html = document.documentElement
    if (theme === 'light') {
      setLight()
    } else if (theme === 'dark') {
      setDark()
    } else {
      const prefersDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)',
      )
      if (prefersDarkScheme.matches) {
        setDark()
      } else {
        setLight()
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn('h-8 w-8 shrink-0', className)}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
