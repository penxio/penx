'use client'

import React, { useMemo, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import { LogOutIcon } from 'lucide-react'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface Props {}

const platform = Capacitor.getPlatform()

export function ProfileContent({}: Props) {
  const { session, logout } = useSession()
  return (
    <div className="flex h-full flex-1 flex-col gap-2 px-3 pt-4">
      <div className="flex items-center gap-2 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={getUrl(session?.image)} alt={session?.name} />
          <AvatarFallback
            className={cn(
              'rounded-lg text-white',
              generateGradient(session.name),
            )}
          >
            {session?.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{session?.name}</span>
          <span className="truncate text-xs">{session?.email}</span>
        </div>
      </div>
      <div
        className="bg-foreground/5 flex items-center justify-between rounded-lg px-3 py-2"
        onClick={() => {
          logout()
        }}
      >
        <div>Logout</div>
        <LogOutIcon size={20} className="text-foreground/60"></LogOutIcon>
      </div>
    </div>
  )
}
