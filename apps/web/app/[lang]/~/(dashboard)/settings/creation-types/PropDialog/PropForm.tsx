'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { produce } from 'immer'
import { PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { api, trpc } from '@penx/trpc-client'
import { Prop, PropType } from '@penx/types'
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
import { NumberInput } from '@penx/uikit/NumberInput'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { uniqueId } from '@penx/unique-id'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
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
  const { setIsOpen, prop, struct } = usePropDialog()
  const { refetch } = trpc.struct.list.useQuery()

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
        const props = (struct.props as Prop[]) || []
        const index = props.findIndex((item) => item.id === prop.id)!
        props[index] = { ...props[index], ...data } as any
        await api.struct.update.mutate({
          id: struct.id,
          props,
        })
      } else {
        await api.struct.update.mutate({
          id: struct.id,
          props: [...((struct.props as any) || []), { id: uniqueId(), ...data }],
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
                <Trans id="Name"></Trans>
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
                <Trans id="Slug"></Trans>
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
                <Trans id="Type"></Trans>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PropType.TEXT}>
                    <Trans id="Text"></Trans>
                  </SelectItem>
                  <SelectItem value={PropType.IMAGE}>
                    <Trans id="Image"></Trans>
                  </SelectItem>
                  <SelectItem value={PropType.URL}>
                    <Trans id="URL"></Trans>
                  </SelectItem>
                  <SelectItem value={PropType.SINGLE_SELECT}>
                    <Trans id="Single select"></Trans>
                  </SelectItem>
                  {/* <SelectItem value={PropType.MULTIPLE_SELECT}>
                    <Trans id="Multiple select"></Trans>
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
                      <Trans id="Options"></Trans>
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
