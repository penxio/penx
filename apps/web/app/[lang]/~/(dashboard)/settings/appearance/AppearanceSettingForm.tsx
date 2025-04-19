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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { supportLanguages } from '@/lib/supportLanguages'
import { trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penx/db/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  // themeName: z.string().optional(),
  color: z.string().optional(),
  baseFont: z.string().optional(),
  locale: z.string().optional(),
})

interface Props {
  site: Site
}

export function AppearanceSettingForm({ site }: Props) {
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const { appearance } = (site.config || {}) as {
    appearance: z.infer<typeof FormSchema>
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      // themeName: site.themeName || '',
      color: appearance?.color || 'oklch(0.656 0.241 354.308)',
      baseFont: appearance?.baseFont || 'sans',
      locale: appearance?.locale || 'en',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        // themeName: data.themeName,
        config: {
          ...(site.config as any),
          appearance: {
            color: data.color,
            baseFont: data.baseFont,
            locale: data.locale,
          },
        },
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
        {/* <FormField
          control={form.control}
          name="themeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="garden">Garden</SelectItem>
                  <SelectItem value="aside">Aside</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="sue">Sue</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="maple">Maple</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="publication">Publication</SelectItem>
                  <SelectItem value="docs">Docs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a default" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportLanguages.map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="oklch(0.637 0.237 25.331)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-red-500"></div>
                      <div>Red</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.705 0.213 47.604)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-orange-500"></div>
                      <div>Orange</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.769 0.188 70.08)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-amber-500"></div>
                      <div>Amber</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.795 0.184 86.047)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-yellow-500"></div>
                      <div>Yellow</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.768 0.233 130.85)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-lime-500"></div>
                      <div>Lime</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.723 0.219 149.579)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-green-500"></div>
                      <div>Green</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.696 0.17 162.48)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-emerald-500"></div>
                      <div>Emerald</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.704 0.14 182.503)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-teal-500"></div>
                      <div>Teal</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.715 0.143 215.221)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-cyan-500"></div>
                      <div>Cyan</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.685 0.169 237.323)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-sky-500"></div>
                      <div>Sky</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.623 0.214 259.815)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-blue-500"></div>
                      <div>Blue</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.585 0.233 277.117)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-indigo-500"></div>
                      <div>Indigo</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.606 0.25 292.717)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-violet-500"></div>
                      <div>Violet</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.627 0.265 303.9)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-purple-500"></div>
                      <div>Purple</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.667 0.295 322.15)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-fuchsia-500"></div>
                      <div>Fuchsia</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.656 0.241 354.308)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-pink-500"></div>
                      <div>Pink</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="oklch(0.645 0.246 16.439)">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded bg-rose-500"></div>
                      <div>Rose</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseFont"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base font </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font family" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sans">Sans</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">mono</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
