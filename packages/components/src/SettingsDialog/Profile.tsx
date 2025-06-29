'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '@penx/api'
import { FileUpload } from '@penx/components/FileUpload'
import { UpdateProfileInput, updateProfileInputSchema } from '@penx/constants'
import { useSession } from '@penx/session'
import { Badge } from '@penx/uikit/badge'
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
import { Textarea } from '@penx/uikit/textarea'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

export function Profile() {
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: (input: UpdateProfileInput) => {
      return api.updateProfile(input)
    },
  })
  const { data, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
  })

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: {
      image: '',
      displayName: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      image: data.image || '',
      displayName: data.displayName || '',
      bio: data.bio || '',
    })
  }, [data, form])

  async function onSubmit(data: UpdateProfileInput) {
    try {
      await mutateAsync(data)
      refetch()
      // update({
      //   type: 'update-profile',
      //   ...data,
      // })
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col justify-center gap-3">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => <FileUpload {...field} />}
          />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Name</Trans>
              </FormLabel>
              <FormDescription>
                <Trans>This is your public display name.</Trans>
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Bio</Trans>
              </FormLabel>
              <FormDescription>
                <Trans>A brief your introduction.</Trans>
              </FormDescription>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-32">
            {isPending ? (
              <LoadingDots />
            ) : (
              <p>
                <Trans>Save</Trans>
              </p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
