'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  journal: z.boolean(),
  gallery: z.boolean(),
  page: z.boolean(),
  database: z.boolean(),
  contribute: z.boolean(),
})

interface Props {
  site: Site
}

export function FeaturesSettingForm({ site }: Props) {
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.enableFeatures.useMutation()
  const { features } = (site.config || {}) as {
    features: z.infer<typeof FormSchema>
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      journal: features?.journal || false,
      gallery: features?.gallery || false,
      page: features?.page || false,
      database: features?.database || false,
      contribute: features?.contribute || false,
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log('enable or disable features:', data)

      await mutateAsync({
        siteId: site.id,
        ...data,
      })
      refetch()
      toast.success('Save successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <div className="text-xl font-bold">Advanced features</div>
      <div className="text-foreground/50 mb-6">
        Enable or disable advanced features
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* <FormField
          control={form.control}
          name="journal"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feature-journal"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                  }}
                />
                <Label htmlFor="feature-journal">Journal</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feature-page"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                  }}
                />
                <Label htmlFor="feature-page">Page</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feature-database"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                  }}
                />
                <Label htmlFor="feature-database">Database</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gallery"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feature-gallery"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                  }}
                />
                <Label htmlFor="feature-gallery">Gallery</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contribute"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feature-contribute"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                  }}
                />
                <Label htmlFor="feature-contribute">Contribute</Label>
                <FormDescription>
                  Allow other users submit posts.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Save'}
        </Button>
      </form>
    </Form>
  )
}
