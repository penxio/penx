'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { Prop, PropType } from '@penx/types'
import { api, trpc } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { ColorSelector } from './ColorSelector'
import { usePropDialog } from './usePropDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  slug: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Slug is required' }),
  options: z.array(z.any()),
})

export function PropForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, prop, mold } = usePropDialog()
  const { refetch } = trpc.mold.list.useQuery()

  const isEdit = !!prop

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? prop.name : '',
      slug: isEdit ? prop.slug : '',
      type: isEdit ? prop.type : '',
      options: isEdit ? prop.options || [] : [],
    },
  })

  const type = form.watch('type')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      if (isEdit) {
        const props = (mold.props as Prop[]) || []
        const index = props.findIndex((item) => item.id === prop.id)!
        props[index] = { ...props[index], ...data } as any
        await api.mold.update.mutate({
          id: mold.id,
          props,
        })
      } else {
        await api.mold.update.mutate({
          id: mold.id,
          props: [...((mold.props as any) || []), { id: uniqueId(), ...data }],
        })
      }

      await refetch()
      setIsOpen(false)
      toast.success(isEdit ? 'Updated successfully!' : 'Added successfully!')
    } catch (error) {
      console.log('=======error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  console.log('========>>>>>:', form.getValues())

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Name</Trans>
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
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans>Slug</Trans>
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>Type</Trans>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PropType.TEXT}>
                    <Trans>Text</Trans>
                  </SelectItem>
                  <SelectItem value={PropType.IMAGE}>
                    <Trans>Image</Trans>
                  </SelectItem>
                  <SelectItem value={PropType.URL}>
                    <Trans>URL</Trans>
                  </SelectItem>
                  <SelectItem value={PropType.SINGLE_SELECT}>
                    <Trans>Single select</Trans>
                  </SelectItem>
                  {/* <SelectItem value={PropType.MULTIPLE_SELECT}>
                    <Trans>Multiple select</Trans>
                  </SelectItem> */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === PropType.SINGLE_SELECT && (
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => {
              return (
                <FormItem className="bg-foreground/5 w-full rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="font-bold">
                      <Trans>Options</Trans>
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-brand"
                      onClick={() => {
                        const options = [
                          ...field.value,
                          { name: '', color: '' },
                        ]

                        field.onChange(options)
                      }}
                    >
                      <PlusIcon size={18} />
                      <div>Add option</div>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="flex flex-col gap-1">
                      {field.value.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2"
                        >
                          <ColorSelector
                            value={option.color}
                            onChange={(color) => {
                              const options = produce(field.value, (draft) => {
                                draft[index].color = color
                              })
                              field.onChange(options)
                            }}
                          />
                          <Input
                            size="sm"
                            value={option.name}
                            onChange={(e) => {
                              const options = produce(field.value, (draft) => {
                                draft[index].name = e.target.value
                              })
                              field.onChange(options)
                            }}
                            placeholder="Option name"
                            className="bg-background"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="hover:bg-foreground/10 size-7 rounded-md"
                          >
                            <XIcon
                              size={20}
                              className="text-foreground/50"
                            ></XIcon>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        <div>
          <Button
            type="submit"
            className="w-24"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>{isEdit ? 'Update' : 'Add'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
