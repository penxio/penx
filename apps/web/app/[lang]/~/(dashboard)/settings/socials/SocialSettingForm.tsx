'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/button'
import { Card } from '@penx/uikit/card'
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
import { useSite } from '@penx/hooks/useSite'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { Socials } from '@penx/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  farcaster: z.string().optional(),
  x: z.string().optional(),
  mastodon: z.string().optional(),
  github: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  threads: z.string().optional(),
  instagram: z.string().optional(),
  medium: z.string().optional(),
  discord: z.string().optional(),
  email: z.string().optional(),
  slack: z.string().optional(),
  telegram: z.string().optional(),
  bilibili: z.string().optional(),
})

interface Props {}

export function SocialSettingForm({}: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const social = (site.socials || {}) as z.infer<typeof FormSchema>

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farcaster: social?.farcaster || '',
      x: social?.x || '',
      mastodon: social?.mastodon || '',
      github: social?.github || '',
      facebook: social?.facebook || '',
      youtube: social?.youtube || '',
      linkedin: social?.linkedin || '',
      threads: social?.threads || '',
      instagram: social?.instagram || '',
      discord: social?.discord || '',
      medium: social?.medium || '',
      slack: social?.slack || '',
      telegram: social?.slack || '',
      bilibili: social?.medium || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        socials: data,
      })
      refetch()
      toast.success('Updated successfully!')
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
          name="x"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtube"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Youtube</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discord"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Discord</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Linkedin</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slack"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Slack</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="threads"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Threads</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mastodon"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mastodon</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medium"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Medium</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegram"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Telegram</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="farcaster"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Farcaster</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bilibili"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bilibili</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
