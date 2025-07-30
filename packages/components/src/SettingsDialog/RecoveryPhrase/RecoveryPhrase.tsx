import { FC, useEffect, useRef, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Copy, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { CloudBackup } from './CloudBackup'
import { Recover } from './Recover'

interface Props {}

export const RecoveryPhrase: FC<Props> = () => {
  const [blur, setBlur] = useState(true)
  const { data } = useSession()
  const { copy, copiedText } = useCopyToClipboard()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isLoading, data: mnemonic } = useQuery({
    queryKey: ['Mnemonic', data?.spaceId],
    queryFn: () => getMnemonicFromLocal(data?.userId!),
  })

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    if (!mnemonic) return
    const success = await copy(mnemonic)
    if (success) {
      toast.info(t`Copied to clipboard`)
      // Set timeout to clear copiedText after 2 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        // Reset copiedText by copying empty string
        copy('')
      }, 2000)
    }
  }

  if (isLoading) return null
  if (!mnemonic) return <Recover />

  const words = mnemonic.split(' ')

  return (
    <div className="flex max-w-[640px] flex-col gap-2">
      <div className="bg-foreground/6 relative flex items-center justify-between gap-2 rounded-2xl p-5">
        <div className="grid w-full grid-cols-3 gap-y-4">
          {words.map((word, index) => (
            <div key={word} className="flex flex-1 items-center gap-1">
              <div>{index + 1}.</div>
              <div>{word}</div>
            </div>
          ))}
        </div>

        {blur && (
          <div
            className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center"
            style={{
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          >
            <Button
              className="relative z-10"
              size="icon"
              onClick={() => setBlur(!blur)}
            >
              <Eye size={20} />
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="flex gap-1"
          variant="ghost"
          onClick={() => setBlur(!blur)}
        >
          <Eye size={18}></Eye>
          <div>
            {blur ? (
              <Trans>Show recovery phrase</Trans>
            ) : (
              <Trans>Hide recovery phrase</Trans>
            )}
          </div>
        </Button>

        <Button className="flex gap-2" variant="ghost" onClick={handleCopy}>
          <Copy size={18}></Copy>
          <div>
            {copiedText ? (
              <Trans>Copied to clipboard</Trans>
            ) : (
              <Trans>Copy to clipboard</Trans>
            )}
          </div>
        </Button>
      </div>
      {/* <div className="mt-3 flex items-center">
        <CloudBackup />
      </div> */}
    </div>
  )
}
