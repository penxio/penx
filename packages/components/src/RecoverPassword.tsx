import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { decryptString } from '@penx/encryption'
import { setMnemonicToLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}
export function RecoverPassword({ className }: Props) {
  const { session } = useSession()
  const [value, setValue] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['MnemonicInfo'],
    queryFn: api.getMnemonicInfo,
  })
  async function confirm() {
    try {
      const decrypted = decryptString(
        data?.encryptedMnemonic!,
        `${session.userId}.${value}`,
      )
      if (!decrypted) return toast.error(t`Invalid recovery password!`)

      store.app.setPasswordNeeded(false)
      await setMnemonicToLocal(session.userId, decrypted)
      appEmitter.emit('APP_LOGIN_SUCCESS', session)
    } catch (error) {
      toast.error(t`Invalid recovery password!`)
    }
  }
  return (
    <div
      className={cn(
        'drag bg-background/80 flex h-screen w-full items-center justify-center',
        className,
      )}
    >
      <div className="-mt-[20vh] flex max-w-[360px] flex-col items-center gap-3 sm:w-full md:w-[360px]">
        <img
          src="https://penx.io/images/logo.svg"
          className="shadow-popover size-20 rounded-2xl"
        />
        <div className="text-foreground no-drag text-xl font-bold">
          <Trans>Recovery password</Trans>
        </div>
        <div className="text-foreground/60 no-drag">
          <Trans>Input your recovery password to sync your data.</Trans>
        </div>
        <Input
          size="xl"
          placeholder={t`Recovery password`}
          className="no-drag dark:border-foreground/80 mt-3 w-full text-center"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && !isLoading) {
              confirm()
            }
          }}
        />
        <Button
          size="xl"
          className="no-drag mt-2 w-full"
          disabled={!value || isLoading}
          onClick={confirm}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value && !isLoading) {
              confirm()
            }
          }}
        >
          <Trans>Confirm</Trans>
        </Button>
      </div>
    </div>
  )
}
