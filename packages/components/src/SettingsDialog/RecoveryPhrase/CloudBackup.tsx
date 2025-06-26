import { useGoogleDriveToken } from '@penx/hooks/useGoogleDriveToken'
import { CloudBackupDialog } from './CloudBackupDialog'
import { GoogleOauthButton } from './GoogleOauthButton'

export function CloudBackup() {
  const { data: token, isLoading } = useGoogleDriveToken()

  if (isLoading) return null // TODO: show spinner

  if (!token?.access_token) {
    return <GoogleOauthButton from="mnemonic" />
  }

  return <CloudBackupDialog />
}
