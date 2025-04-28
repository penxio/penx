'use client'

import React, { useState } from 'react'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'
import { useSiteContext } from '@penx/contexts/SiteContext'
// import { SocialNav } from '@penx/components/SocialNav'
import { Link } from '@penx/libs/i18n'
import { getBlockClassName } from '@penx/utils'

export const SocialLinksElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props
  const site = useSiteContext()

  return (
    <PlateElement
      ref={ref}
      {...props}
      className={cn(
        props.className,
        className,
        getBlockClassName(props),
        'flex items-center justify-center',
      )}
      contentEditable={false}
    >
      {/* {Object.keys(site.socials as any).length > 0 ? (
        <SocialNav site={site as any} size={5} className="" />
      ) : (
        <Link
          href="/~/settings/socials"
          className="bg-foreground/5 hover:bg-foreground/10 inline-flex cursor-pointer rounded-xl p-2 text-sm"
        >
          No social links configured. Go to configure &rarr;
        </Link>
      )} */}

      {children}
    </PlateElement>
  )
})
