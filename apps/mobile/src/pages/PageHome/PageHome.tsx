import React, { useEffect, useRef, useState } from 'react'
import { AnimatedJournalInput } from '@/components/AnimatedJournalInput'
import Menu from '@/components/Menu'
import { useTheme } from '@/components/theme-provider'
import { useGuideEntryHidden } from '@/hooks/useGuideEntryHidden'
import { useKeyboard, useKeyboardChange } from '@/hooks/useKeyboard'
import { mainBackgroundLight } from '@/lib/constants'
import { useMoreStructDrawer } from '@/pages/PageHome/HomeFooter/MoreStructDrawer/useMoreStructDrawer'
import { Capacitor } from '@capacitor/core'
import { useQuery } from '@tanstack/react-query'
import { api } from '@penx/api'
// import { SafeArea } from '@capacitor-community/safe-area'
import { usePanels } from '@penx/hooks/usePanels'
import { useQuickInputOpen } from '@penx/hooks/useQuickInputOpen'
import { PanelType } from '@penx/types'
import { HomeFooter } from './HomeFooter/HomeFooter'
import { Journals } from './Journals'
import { WidgetNav } from './WidgetNav'
import { WidgetRender } from './WidgetRender'

const PageHome = ({ nav }: any) => {
  const { open, setOpen } = useQuickInputOpen()
  const [scrolled, setScrolled] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { panels } = usePanels()

  const { height, isShow, setState } = useKeyboard()
  useKeyboardChange()
  const { isDark } = useTheme()

  // const { data: isDark } = useQuery({
  //   queryKey: ['isDark'],
  //   queryFn: async () => {
  //     const mode = await DarkMode.isDarkMode()
  //     return mode.dark
  //   },
  // })

  // to enable mobile network
  useQuery({
    queryKey: ['mobile', 'session'],
    queryFn: async () => {
      return api.getSession()
    },
  })

  useEffect(() => {
    if (!isShow && open) setOpen(false)
  }, [isShow])

  const { isLoading } = useGuideEntryHidden()
  if (isLoading) return null

  return (
    <>
      {/* <AnimatedJournalInput open={open} setOpen={setOpen} /> */}
      {/* <Journals /> */}
      <WidgetNav />
      <WidgetRender />
      <HomeFooter
        open={open}
        onAdd={() => {
          // setState({
          //   height: 300,
          //   isShow: true,
          // })
          setOpen(true)
          setTimeout(() => {
            inputRef.current?.focus()
          }, 0)
        }}
      />
    </>
  )
}

export default PageHome
