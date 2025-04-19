'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NumberInput } from '@/components/NumberInput'
import { useSiteContext } from '@/components/SiteContext'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/ui/components/form'
import { useSite } from '@/hooks/useSite'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { useDebouncedCallback } from 'use-debounce'
import { z } from 'zod'
import { useThemeName } from '../hooks/useThemeName'
import { ColorPicker } from './components/ColorPicker'
import { useDesignContext } from './hooks/DesignContext'

const FormSchema = z.object({
  bgColor: z.string().min(1),
  containerWidth: z.string().min(1),
  rowHeight: z.string().min(1),
  margin: z.string().min(1),
})

export function DesignSettings() {
  const { refetch } = useSite()
  const { config, setConfig } = useDesignContext()
  const { themeName } = useThemeName()
  const site = useSiteContext()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { mutateAsync } = trpc.site.updateSite.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bgColor: config.bgColor,
      containerWidth: config.containerWidth.toString(),
      rowHeight: config.rowHeight.toString(),
      margin: config.margin.toString(),
    },
  })

  const bgColor = form.watch('bgColor')
  const containerWidth = form.watch('containerWidth')
  const rowHeight = form.watch('rowHeight')
  const margin = form.watch('margin')

  const debouncedUpdate = useDebouncedCallback(
    async (newThemeConfig: any) => {
      await mutateAsync({
        id: site.id,
        themeConfig: newThemeConfig,
      })
      await refetch()
    },
    // delay in ms
    200,
  )

  useEffect(() => {
    const values = form.getValues()
    const config = {
      bgColor: values.bgColor,
      containerWidth: parseInt(values.containerWidth),
      rowHeight: parseInt(values.rowHeight),
      margin: parseInt(values.margin),
    }
    setConfig(config)

    const newThemeConfig = produce(themeConfig, (draft) => {
      if (!draft?.[themeName]) draft[themeName] = {}
      draft[themeName].common = {
        ...draft[themeName].common,
        ...config,
      }
    })

    debouncedUpdate(newThemeConfig)
  }, [bgColor, containerWidth, rowHeight, margin])

  async function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bgColor"
          render={({ field }) => (
            <FormItem className="flex w-full items-center justify-between">
              <FormLabel className="">
                <div className="">
                  <Trans>Site background</Trans>
                </div>
              </FormLabel>
              <FormControl>
                <ColorPicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="containerWidth"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Container width</Trans>
              </FormLabel>
              <FormControl>
                <NumberInput
                  size="sm"
                  placeholder=""
                  precision={0}
                  {...field}
                  className="bg-background w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rowHeight"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Row height</Trans>
              </FormLabel>
              <FormControl>
                <NumberInput
                  size="sm"
                  placeholder=""
                  precision={0}
                  {...field}
                  className="bg-background w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="margin"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Margin</Trans>
              </FormLabel>
              <FormControl>
                <NumberInput
                  size="sm"
                  placeholder=""
                  precision={0}
                  {...field}
                  className="bg-background w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
