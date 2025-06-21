import React from 'react'
import isEqual from 'react-fast-compare'
import { useForm } from 'react-hook-form'
import { MobileContent } from '@/components/MobileContent'
import { MobileCreationEditor } from '@/components/MobileCreationEditor'
import { MobilePropList } from '@/components/MobilePropList/MobilePropList'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { z } from 'zod'
import { CreationTitle } from '@penx/components/Creation/CreationTitle'
import { defaultEditorContent } from '@penx/constants'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { StructType } from '@penx/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Button } from '@penx/uikit/ui/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { Input } from '@penx/uikit/ui/input'
import { cn } from '@penx/utils'

const FormSchema = z.object({
  checked: z.boolean().optional(),
  title: z.string().optional(),
  cells: z.any(),
  content: z.any(),
})

interface Props {
  struct: Struct
}

export const PageNewCreation = ({ struct }: Props) => {
  return <Content struct={struct} />
}

function Content({ struct }: Props) {
  const isTask = struct.type === StructType.TASK
  const addCreation = useAddCreation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      checked: false,
      cells: {},
      content: defaultEditorContent,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { content, checked, cells, ...rest } = data
    const isEmpty = () => {
      if (!isEqual(content, defaultEditorContent)) return false
      if (checked) return false
      if (Object.keys(cells).length) return false
      if (Object.values(rest).filter((i) => !!i).length) return false
      return true
    }

    if (!isEmpty()) {
      await addCreation({
        type: struct.type,
        ...data,
        content: JSON.stringify(content),
      })
      appEmitter.emit('ROUTE_TO_BACK')
    }
  }

  return (
    <MobileContent
      backgroundColor={isTask ? '#fff' : '#f6f6f6'}
      onBack={() => {
        form.handleSubmit(onSubmit)()
      }}
      rightSlot={
        <div className="p-2">
          <Button
            type="submit"
            size="sm"
            className="rounded-full"
            onClick={() => {
              form.handleSubmit(onSubmit)
              appEmitter.emit('ROUTE_TO_BACK')
            }}
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            {struct?.type === StructType.TASK && (
              <FormField
                control={form.control}
                name="checked"
                render={({ field }) => (
                  <FormControl>
                    <Checkbox
                      className="border-foreground mt-[6px] size-5"
                      checked={!!field.value}
                      onCheckedChange={(v) => {
                        field.onChange(v)
                      }}
                    />
                  </FormControl>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormControl>
                  <CreationTitle {...field} />
                </FormControl>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cells"
            render={({ field }) => (
              <FormControl>
                <MobilePropList
                  cells={field.value}
                  struct={struct!}
                  onUpdateProps={(newCells) => {
                    field.onChange(newCells)
                  }}
                />
              </FormControl>
            )}
          />

          <div className={cn('mx-auto w-full max-w-2xl px-0')}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormControl>
                  <MobileCreationEditor
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  />
                </FormControl>
              )}
            />
          </div>
        </form>
      </Form>
    </MobileContent>
  )
}
