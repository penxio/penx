'use client'

import React from 'react'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { defaultNavLinks } from '@penx/constants'
import { NavLink } from '@penx/types'

export const NavigationList = () => {
  const site = useSiteContext()
  let navLinks = (site.navLinks || defaultNavLinks) as NavLink[]

  return (
    <div className="flex gap-3">
      {navLinks.map((item, index) => {
        if (!item.visible) return null
        return (
          <div key={index} className="select-none text-sm font-semibold">
            {item.title}
          </div>
        )
      })}
    </div>
  )
}
