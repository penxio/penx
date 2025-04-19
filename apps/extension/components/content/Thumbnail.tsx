import { forwardRef, useCallback, useMemo } from 'react'
import { AppType } from '@penx/constants'
import { useAppType } from './hooks/useAppType'

interface ThumbnailProps {
  x: number
  y: number
}

export const Thumbnail = forwardRef<HTMLDivElement, ThumbnailProps>(
  function Thumbnail({ x, y, ...rest }: ThumbnailProps, ref) {
    const { setAppType: setType } = useAppType()

    return (
      <div
        className="fixed"
        ref={ref}
        style={{
          // position: 'fixed',
          position: 'absolute',
          left: x + 20,
          top: y,
          zIndex: 100000,
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          cursor: 'pointer',
          display: 'inline-flex',
          boxShadow:
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          width: 20,
          height: 20,
          background: 'white',
        }}
        {...rest}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          // TODO...
          setType(AppType.NOTE)
        }}
      >
        P
      </div>
    )
  },
)
