'use client'

import React from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { defaultNavLinks } from '@/lib/constants'
import { NavLink } from '@/lib/theme.types'

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
