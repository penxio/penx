'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { z } from 'zod'
import { Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { IStructNode } from '@penx/model-type'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { useStructDialog } from './useStructDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

interface Props {
  onSubmitSuccess?: (struct: IStructNode) => void
}
export function CreateStructForm({ onSubmitSuccess }: Props) {
  const { struct, setIsOpen } = useStructDialog()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const struct = store.structs.createStruct(data)
    setIsOpen(false)
    onSubmitSuccess?.(struct)
  }

  useEffect(() => {
    function handle() {
      form.handleSubmit(onSubmit)()
    }
    appEmitter.on('SUBMIT_CREATE_STRUCT', handle)
    return () => appEmitter.off('SUBMIT_CREATE_STRUCT')
  }, [onSubmit, form])

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
                <Input
                  autoFocus
                  placeholder={t`Struct name`}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="w-full px-4">
            <Trans>Create</Trans>
          </Button>
        </div>
      </form>
    </Form>
  )
}
