'use client'

import React, { useEffect } from 'react'
import { DarkMode } from '@aparajita/capacitor-dark-mode'
import { AreasPopover } from '@penx/components/AreasPopover'
import { AreaWidgets } from '@penx/components/AreaWidgets'
import { MobileAddCreationButton } from './MobileAddCreationButton'

export function MobileHome() {
  const [mode, setMode] = React.useState({})
  useEffect(() => {
    DarkMode.isDarkMode().then((isDark) => setMode(isDark))
  }, [])
  return (
    <div className="">
      {/* <QuickSearchTrigger /> */}
      <div>isDark: {JSON.stringify(mode, null, 2)}</div>
      <AreaWidgets />
      {/* <div className="fixed bottom-3 left-0 flex w-full items-center justify-center">
        <MobileAddCreationButton />
      </div> */}
    </div>
  )
}
