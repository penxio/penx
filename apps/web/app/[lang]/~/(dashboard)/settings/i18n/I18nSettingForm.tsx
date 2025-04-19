'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
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
import { RadioGroup, RadioGroupItem } from '@penx/uikit/ui/radio-group'
import { Switch } from '@penx/uikit/ui/switch'
import { updateSiteState } from '@/hooks/useSite'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { supportLanguages } from '@/lib/supportLanguages'
import { trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.record(z.any())

interface Props {
  site: Site
}

export function I18nSettingForm({ site }: Props) {
  const { isPending, mutateAsync } = trpc.site.updateLocalesConfig.useMutation()
  const { locales = [] } = (site.config || {}) as {
    locales: string[]
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: locales.reduce(
      (acc, locale) => ({ ...acc, [locale]: true }),
      {},
    ),
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const newSite = await mutateAsync({
        siteId: site.id,
        locales: Object.entries(data)
          .filter(([_, value]) => value)
          .map(([locale]) => locale),
      })

      updateSiteState(newSite)

      toast.success('Save successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <div className="text-xl font-bold">Site internationalization</div>
      <div className="text-foreground/50 mb-6">
        Enable or disable language support, it's useful for internationalizing
        your post.
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {supportLanguages.map(([code, name]) => {
            return (
              <FormField
                key={code}
                control={form.control}
                name={code}
                render={({ field }) => (
                  <FormItem className="w-48">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`lang-${code}`}
                        // size="sm"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                        }}
                      />
                      <Label
                        htmlFor={`lang-${code}`}
                        className="flex items-center"
                      >
                        <span className="shrink-0">{name}</span>
                        <span className="text-foreground/50 text-xs">
                          ({code})
                        </span>
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
        </div>

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
