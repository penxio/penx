import { useEffect, useMemo, useRef } from 'react'
import { EditWidget } from '@/components/EditWidget/EditWidget'
import { useTheme } from '@/components/theme-provider'
import { useScrolled } from '@/hooks/useScrolled'
import {
  EDIT_WIDGET,
  HEADER_HEIGHT,
  mainBackgroundLight,
} from '@/lib/constants'
import { isAndroid, isIOS } from '@/lib/utils'
import { IonContent } from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { useStructs } from '@penx/hooks/useStructs'
import { useWidget } from '@penx/hooks/useWidget'
import { Widget } from '@penx/types'
import { cn } from '@penx/utils'
import { WidgetName } from '@penx/widgets/WidgetName'
import { AllCreations } from './AllCreations'
import { AllStructs } from './AllStructs/AllStructs'
import { FavoritesCreations } from './FavoritesCreations'
import { Journals } from './Journals'
import { RecentlyEdited } from './RecentlyEdited'
import { RecentlyOpened } from './RecentlyOpened'
import { StructCreations } from './StructCreations/StructCreations'

interface Props {
  //
}

export const WidgetRender = ({}: Props) => {
  const { area } = useArea()
  const widgets = (area?.widgets || []) as Widget[]
  const { widget } = useWidget()
  const { isDark } = useTheme()
  const { scrolled, setScrolled } = useScrolled()

  const navHeight = HEADER_HEIGHT + 10

  const pt = useMemo(() => {
    if (isAndroid)
      return `calc(var(--safe-area-inset-top) + 8px + ${navHeight}px)`
    if (isIOS) return `calc(var(--safe-area-inset-top) + ${navHeight}px)`
    return 12 + navHeight
  }, [isAndroid, isIOS])

  return (
    <>
      {widgets.map((item, index) => {
        const active = widget.id === item.id
        return (
          <IonContent
            key={item.id}
            fullscreen
            className={cn(
              'relative hidden h-screen flex-col',
              active && 'flex',
            )}
            style={{
              '--background': isDark ? '#222' : mainBackgroundLight,
              boxShadow: '-10px 0 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            // scrollEvents={true}
            // onIonScroll={async (event) => {
            //   const scrollTop = event.detail.scrollTop
            //   const isScrolled = scrollTop > 0
            //   if (scrolled !== isScrolled) {
            //     setScrolled(isScrolled)
            //   }
            // }}
          >
            {/* <div
              className="fixed left-0 right-0 top-0 z-50"
              style={{
                height: 'calc(var(--safe-area-inset-top) + 40px)',
                background:
                  'linear-gradient(to bottom, #f1e4e3 0%, transparent 100%)',
              }}
            ></div> */}

            <div className="text-foreground no-scrollbar flex h-screen flex-col overflow-hidden">
              <div
                className={cn('flex-1 overflow-auto px-3 pb-24')}
                // style={{
                //   paddingTop: 'calc(var(--safe-area-inset-top) + 100px)',
                // }}
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop
                  const isScrolled = scrollTop > 0
                  if (scrolled !== isScrolled) {
                    setScrolled(isScrolled)
                  }
                }}
                style={
                  {
                    '--background': 'oklch(1 0 0)',
                    paddingTop: pt,
                  } as any
                }
              >
                <Content widget={item} />
              </div>
            </div>

            {/* <div
              className="fixed bottom-0 left-0 right-0 top-0 z-[-1] opacity-40 dark:opacity-0"
              style={{
                filter: 'blur(150px) saturate(150%)',
                transform: 'translateZ(0)',
                backgroundImage:
                  'radial-gradient(at 27% 37%, #eea5ba 0, transparent 50%), radial-gradient(at 97% 21%, #fd3a4e 0, transparent 50%), radial-gradient(at 52% 99%, #e4c795 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #8ca8e8 0, transparent 50%), radial-gradient(at 33% 50%, #9772fe 0, transparent 50%), radial-gradient(at 79% 53%, #3a8bfd 0, transparent 50%)',
              }}
            ></div> */}
          </IonContent>
        )
      })}
    </>
  )
}

function Content({ widget }: { widget: Widget }) {
  if (widget.type === EDIT_WIDGET.type) {
    return <EditWidget />
  }

  if (widget.type === WidgetType.JOURNAL) {
    return <Journals />
  }

  if (widget.type === WidgetType.STRUCT) {
    return <StructCreations structId={widget.structId!} />
  }

  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <AllCreations />
  }

  if (widget.type === WidgetType.FAVORITES) {
    return <FavoritesCreations />
  }

  if (widget.type === WidgetType.ALL_STRUCTS) {
    return <AllStructs />
  }

  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <RecentlyEdited />
  }

  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <RecentlyOpened />
  }

  return null
}
