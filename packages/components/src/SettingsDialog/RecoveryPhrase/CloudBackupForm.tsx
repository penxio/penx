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
import { encryptString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { useGoogleDriveToken } from '@penx/hooks/useGoogleDriveToken'
import { getMnemonicFromLocal } from '@penx/mnemonic'
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
  confirmPassword: z.string().min(1),
})

interface Props {
  onBackupSuccess: () => void
}

export function CloudBackupForm({ onBackupSuccess }: Props) {
  const { session } = useSession()
  const { data: token } = useGoogleDriveToken()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function uploadEncryptedRecoveryPhrase(password: string) {
    const { spaceId } = session

    const accessToken = token?.access_token as string
    const drive = new GoogleDrive(accessToken)
    const folderName = `${GOOGLE_DRIVE_FOLDER_NAME}-${spaceId}`
    const parentId = await drive.getOrCreateFolder(folderName)

    const fileName = GOOGLE_DRIVE_RECOVERY_PHRASE_FILE

    let files = await drive.listByName(fileName)

    const mnemonic = await getMnemonicFromLocal(spaceId)

    const encryptedMnemonic = encryptString(mnemonic, password + spaceId)

    if (files.length) {
      await drive.updateJsonContent(files[0].id, {
        encryptedMnemonic,
      })
    } else {
      await drive.createJSON(
        fileName,
        {
          encryptedMnemonic,
        },
        parentId,
      )
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.password !== data.confirmPassword)
      return toast.error(t`Passwords do not match`)
    setLoading(true)
    try {
      await uploadEncryptedRecoveryPhrase(data.password)
      toast.error(t`Backup to google drive successful!`)
      onBackupSuccess?.()
    } catch (error) {
      console.log('=========error:', error)
      toast.error(t`Something went wrong. Please try again later.`)
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

        <FormField
          control={form.control}
          name="confirmPassword"
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
              <Trans>Confirm</Trans>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
