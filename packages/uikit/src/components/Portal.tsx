import React, { FC, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  className?: string
  children?: ReactNode
}

export const Portal: FC<PortalProps> = (props) => {
  const { children, className = '', ...rest } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (typeof document === 'undefined') return null

  return mounted
    ? createPortal(
        <div className={`penx-portal ${className}`.trimEnd()} {...rest}>
          {children}
        </div>,
        document.body,
      )
    : null
}
