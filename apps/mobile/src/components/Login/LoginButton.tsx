'use client'

import React, { useState } from 'react'
import { IonMenuToggle } from '@ionic/react'
import { Drawer } from 'vaul'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { LoginContent } from './LoginContent'
import { ProfileButton } from './ProfileButton'

export function LoginButton() {
  const { isLoading, session } = useSession()
  const [visible, setVisible] = useState(false)
  if (session) {
    return <ProfileButton />
  }
  return (
    <>
      <IonMenuToggle>
        <Button size="sm" onClick={() => setVisible(true)}>
          Log in
        </Button>
      </IonMenuToggle>

      <Drawer.Root open={visible} onOpenChange={setVisible}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background text-foreground fixed bottom-0 left-0 right-0 flex max-h-[95vh] min-h-[95vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
            <div
              aria-hidden
              className="bg-foreground/30 mx-auto mb-4 mt-2 h-1 w-10 flex-shrink-0 rounded-full"
            />

            <DialogTitle className="hidden">
              <DialogDescription />
            </DialogTitle>
            {session && <div>{JSON.stringify(session, null, 2)}</div>}
            <LoginContent setVisible={setVisible} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
