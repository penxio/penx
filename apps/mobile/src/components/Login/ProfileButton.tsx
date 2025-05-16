'use client'

import React, { useState } from 'react'
import { Drawer } from 'vaul'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { LoginContent } from './LoginContent'

export function ProfileButton() {
  const { session, logout } = useSession()
  const [visible, setVisible] = useState(false)
  if (!session) return

  return (
    <>
      <Avatar className="size-7" onClick={() => setVisible(true)}>
        <AvatarImage src={getUrl(session?.image)} />
        <AvatarFallback
          className={cn(generateGradient(session?.name))}
        ></AvatarFallback>
      </Avatar>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background fixed bottom-0 left-0 right-0 flex max-h-[95vh] min-h-[95vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none text-foreground">
            <div
              aria-hidden
              className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>
            <div className="flex flex-1 flex-col items-center">
              <div className="flex flex-1 flex-col items-center">
                <Avatar className="size-12" onClick={() => setVisible(true)}>
                  <AvatarImage src={getUrl(session?.image)} />
                  <AvatarFallback
                    className={cn(generateGradient(session?.name))}
                  ></AvatarFallback>
                </Avatar>
                <div className="font-semibold">{session.name}</div>
                <div className="text-foreground/50 text-sm">
                  {session.email}
                </div>
              </div>
              <div className="pb-6">
                <Button
                  variant="ghost"
                  className="mt-4 text-red-500"
                  onClick={() => {
                    setVisible(false)
                    logout()
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
