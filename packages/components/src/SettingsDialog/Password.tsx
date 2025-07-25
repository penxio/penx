'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '@penx/api'
import { UpdatePasswordInput } from '@penx/constants'
import { encryptString } from '@penx/encryption'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

const FormSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})

interface Props {}

export function Password({}: Props) {
  const { session } = useSession()
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['updatePassword'],
    mutationFn: async (input: UpdatePasswordInput) => {
      const mnemonic = await getMnemonicFromLocal(session.userId)
      await api.updatePassword(input)
      await api.updateMnemonicInfo({
        mnemonic: '',
        encryptedMnemonic: encryptString(
          mnemonic,
          `${session.userId}.${input.password}`,
        ),
      })
      return null
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (data.password !== data.confirmPassword) {
        return toast.error('Passwords do not match!')
      }
      await mutateAsync(data)
      form.reset()
      toast.success('Password updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
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
                <Input
                  type="password"
                  placeholder=""
                  {...field}
                  className="w-full"
                />
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
                <Trans>Confirm password</Trans>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder=""
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? (
              <LoadingDots />
            ) : (
              <p>
                <Trans>Confirm</Trans>
              </p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
