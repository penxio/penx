'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  GOOGLE_DRIVE_FOLDER_NAME,
  GOOGLE_DRIVE_RECOVERY_PHRASE_FILE,
} from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { useGoogleDriveToken } from '@penx/hooks/useGoogleDriveToken'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'

const FormSchema = z.object({
  password: z.string().min(1),
})

interface Props {
  onSubmitSuccess: () => void
}

export function RecoverFromGoogleForm({ onSubmitSuccess }: Props) {
  const { session } = useSession()
  const { data: token } = useGoogleDriveToken()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { spaceId } = session
    setLoading(true)
    try {
      const drive = new GoogleDrive(token!.access_token)
      const folderName = `${GOOGLE_DRIVE_FOLDER_NAME}-${spaceId}`
      const fileName = GOOGLE_DRIVE_RECOVERY_PHRASE_FILE

      const folderId = await drive.getOrCreateFolder(folderName)
      const file = await drive.getFileInFolder(folderId, fileName)

      if (file) {
        const decrypted = decryptString(
          file!.encryptedMnemonic,
          data.password + spaceId,
        )

        if (!decrypted) {
          toast.error('Password is invalid!')
        } else {
          console.log('========decrypted:', decrypted)

          onSubmitSuccess()
        }
      } else {
        toast.success('No backup found!')
      }
    } catch (error) {
      console.log('=========error:', error)
      toast.error(t`Recover failed`)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Password</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <LoadingDots className="bg-background" />
            ) : (
              <Trans>Restore</Trans>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
