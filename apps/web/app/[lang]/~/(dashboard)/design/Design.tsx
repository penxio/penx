'use client'

import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@penx/session'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Link } from '@penx/libs/i18n'
import { ChevronLeft } from 'lucide-react'
import { CommonSettingForm } from './forms/CommonSettingForm'
import { HomeSettingForm } from './forms/HomeSettingForm'
import { GardenDesign } from './GardenDesign/GardenDesign'
import { DesignMode, DesignProvider } from './GardenDesign/hooks/DesignContext'
import { useLoading } from './hooks/useLoading'
import { useThemeName } from './hooks/useThemeName'
import { ThemeDesignTitle } from './ThemeDesignTitle'

export function Design() {
  const { session } = useSession()
  const { isLoading } = useLoading()
  const { themeName } = useThemeName()
  const { themeConfig } = useSiteContext()
  const currentDesignMode =
    themeConfig?.[themeName]?.common?.designMode || themeName === 'garden'
      ? DesignMode.GRID
      : DesignMode.CLASSIC

  const [designMode, setDesignMode] = useState(currentDesignMode)

  const isGrid = designMode === DesignMode.GRID

  return (
    <div className="h-full flex-1 space-y-3">
      <Link
        href={`/~/areas/${session?.activeAreaId}`}
        className="text-foreground bg-accent fixed left-2 top-2 z-50 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl"
      >
        <ChevronLeft size={20} />
      </Link>

      {/* <ThemeDesignTitle designMode={designMode} setDesignMode={setDesignMode} /> */}
      {isLoading && (
        <div>
          <LoadingDots className="bg-foreground" />
        </div>
      )}
      {!isLoading && (
        <>
          {!isGrid && (
            <>
              {/* <CommonSettingForm /> */}
              <HomeSettingForm />
            </>
          )}
          {isGrid && (
            <DesignProvider>
              <GardenDesign />
            </DesignProvider>
          )}
        </>
      )}
    </div>
  )
}
