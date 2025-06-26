import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_OAUTH_REDIRECT_URI,
  GOOGLE_OAUTH_REDIRECT_URI,
} from '@penx/constants'
import { useSession } from '@penx/session'
import { IconGoogle } from '@penx/uikit/components/icons/IconGoogle'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'

interface Props {
  from: 'backup' | 'mnemonic'
}

export function GoogleOauthButton({ from }: Props) {
  const [loading, setLoading] = useState(false)

  const { session } = useSession()
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    errorMessage && toast.error(errorMessage)
  }, [error])

  return (
    <Button
      disabled={loading}
      className="flex  h-[56px] w-[280px] justify-between gap-x-2"
      onClick={() => {
        setLoading(true)
        const redirectUri = GOOGLE_DRIVE_OAUTH_REDIRECT_URI

        const state = `${location.protocol}//${location.host}___${session.userId}___${from}`

        // const scope = 'https://www.googleapis.com/auth/drive'
        // const scope = 'email https://www.googleapis.com/auth/drive.file'
        const scope =
          'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file'

        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${redirectUri}` +
          `&scope=${scope}&client_id=${GOOGLE_CLIENT_ID}&state=${state}&access_type=offline`
        // &prompt=consent

        location.href = googleAuthUrl
      }}
    >
      <IconGoogle className="size-5" />
      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold">Backup to google drive</div>
        <div className="text-xs font-light">Connect to Google drive</div>
      </div>
      {loading && <LoadingDots />}
    </Button>
  )
}
