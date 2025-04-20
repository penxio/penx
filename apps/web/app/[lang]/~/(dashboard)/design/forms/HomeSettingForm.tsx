'use client'

import { useForm } from 'react-hook-form'
import { PlateEditor } from '@penx/uikit/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@penx/uikit/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/ui/form'
import { Input } from '@penx/uikit/ui/input'
import { Label } from '@penx/uikit/ui/label'
import { Switch } from '@penx/uikit/ui/switch'
import { Textarea } from '@penx/uikit/ui/textarea'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@prisma/client'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { useThemeName } from '../hooks/useThemeName'

const FormSchema = z.object({
  showAbout: z.boolean().optional(),
  showLatestPosts: z.boolean().optional(),
  showProjects: z.boolean().optional(),
  showFeatured: z.boolean().optional(),
  showTags: z.boolean().optional(),
})

interface Props {}

export function HomeSettingForm({}: Props) {
  const { refetch } = useSite()
  const site = useSiteContext()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const { themeName } = useThemeName()

  const themeConfig = (site.themeConfig || {}) as Record<string, any>

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      showAbout: themeConfig?.[themeName]?.home?.showAbout ?? false,
      showLatestPosts: themeConfig?.[themeName]?.home?.showLatestPosts ?? false,
      showProjects: themeConfig?.[themeName]?.home?.showProjects ?? false,
      showFeatured: themeConfig?.[themeName]?.home?.showFeatured ?? false,
      // showTags: themeConfig?.[themeName]?.home?.showTags ?? false,
      showTags: themeConfig?.[themeName]?.home?.showTags,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const newThemeConfig = produce(themeConfig, (draft) => {
        if (!draft?.[themeName]) draft[themeName] = {}
        draft[themeName] = {
          ...draft[themeName],
          home: data,
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
        <div className="text-2xl font-bold">Home page</div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="showAbout"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-about"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                  <Label htmlFor="show-about">Show about</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showFeatured"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFeatured"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                  <Label htmlFor="showFeatured">Show featured</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showTags"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showTags"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                  <Label htmlFor="showTags">Show tags</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showLatestPosts"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-latest-posts"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                  <Label htmlFor="show-latest-posts">Show latest posts</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showProjects"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showProjects"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                    }}
                  />
                  <Label htmlFor="showProjects">Show projects</Label>
                </div>
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
