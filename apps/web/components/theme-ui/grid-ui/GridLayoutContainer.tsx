import { CSSProperties, ReactNode } from 'react'
import { DesignMode, Site } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  site: Site
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function GridLayoutContainer({
  site,
  style = {},
  children,
  className,
}: Props) {
  const isGrid = site.theme?.common?.designMode === DesignMode.GRID

  // const isHome = pathname === '/'
  const width = site.theme?.common?.containerWidth || 900

  const pcStyle = !isGrid
    ? ''
    : `
    @media only screen and (min-width: 800px) {
      .grid-layout-container {
        width: ${width}px;
      }
    }
  `

  return (
    <div
      className={cn(
        'grid-layout-container mx-auto mt-0 w-full flex-1',
        className,
      )}
      style={{
        ...style,
      }}
    >
      <style>
        {`
          @media only screen and (max-width: 800px) {
            .grid-layout-container {
              width: auto;
            }
          }
          ${pcStyle}


        `}
      </style>

      {children}
    </div>
  )
}
