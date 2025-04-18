'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { PostListStyle } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { useThemeName } from '../hooks/useThemeName'

const FormSchema = z.object({
  navigationStyle: z.string().optional(),
  postListStyle: z.string().optional(),
})

interface Props {}

export function CommonSettingForm({}: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const { themeName } = useThemeName()

  const { themeConfig = {} } = site as {
    themeConfig: Record<string, any>
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      navigationStyle: themeConfig?.[themeName]?.common?.navigationStyle ?? '',
      postListStyle: themeConfig?.[themeName]?.common?.postListStyle ?? '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log('data:', data)

      const newThemeConfig = produce(themeConfig, (draft) => {
        if (!draft?.[themeName]) draft[themeName] = {}
        draft[themeName] = {
          ...draft[themeName],
          common: data,
        }
      })

      await mutateAsync({
        id: site.id,
        themeConfig: newThemeConfig,
      })
      refetch()
      toast.success('Saved successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-8 rounded-2xl border p-4">
        <div className="text-2xl font-bold">Common</div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="postListStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post list style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a post list style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PostListStyle.SIMPLE}>Simple</SelectItem>
                    <SelectItem value={PostListStyle.CARD}>Card</SelectItem>
                  </SelectContent>
                </Select>
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
      </div>
    </Form>
  )
}
