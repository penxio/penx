'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { z } from 'zod'
import { type Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { localDB } from '@penx/local-db'
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
import { Switch } from '@penx/uikit/ui/switch'
import { ColorSelector } from './ColorSelector'
import { useStructDialog } from './useStructDialog'

// Form schema with better error messages
const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  pluralName: z.string().min(1, { message: 'Plural name is required' }),
  type: z.string().min(1, { message: 'Unique code is required' }),
  showDetail: z.boolean().optional(),
  color: z.string().optional(),
})

type FormData = z.infer<typeof FormSchema>

interface Props {
  struct?: Struct
  isPanel?: boolean
}

// Custom hook for form management
function useStructForm(struct: Struct | undefined) {
  const initialValues = useMemo(
    () => ({
      name: struct?.name || '',
      pluralName: struct?.pluralName || '',
      type: struct?.type || '',
      showDetail: struct?.showDetail || false,
      color: struct?.color || '',
    }),
    [struct],
  )

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues,
  })

  return { form, initialValues }
}

// Custom hook for auto-save functionality
function useAutoSave(
  form: UseFormReturn<FormData>,
  initialValues: FormData,
  struct: Struct | undefined,
  isPanel: boolean | undefined,
  onSubmit: (data: FormData) => Promise<void>,
) {
  const isInitialized = useRef(false)

  // Only watch specific fields to optimize performance
  const watchedFields = form.watch([
    'name',
    'pluralName',
    'color',
    'showDetail',
  ])

  const currentValues = useMemo(
    () => ({
      name: watchedFields[0],
      pluralName: watchedFields[1],
      color: watchedFields[2],
      showDetail: watchedFields[3],
      type: form.getValues('type'), // Get type separately as it's handled differently
    }),
    [watchedFields, form],
  )

  const debouncedSave = useDebouncedCallback(async () => {
    if (!isPanel || !struct) return

    const isValid = await form.trigger()
    if (isValid) {
      const data = form.getValues()
      await onSubmit(data)
    }
  }, 300)

  useEffect(() => {
    if (!isPanel || !struct) return

    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }

    const hasChanged = !isEqual(currentValues, initialValues)
    if (hasChanged) {
      debouncedSave()
    }
  }, [currentValues, isPanel, struct, debouncedSave, initialValues])
}

// Reusable form field component
interface FormFieldWrapperProps {
  name: keyof FormData
  label: ReactNode
  form: UseFormReturn<FormData>
  children: (field: any) => React.ReactElement
  className?: string
}

function FormFieldWrapper({
  name,
  label,
  form,
  children,
  className = 'w-full',
}: FormFieldWrapperProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-xs">
            <Trans>{label}</Trans>
          </FormLabel>
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function EditStructForm({ struct: propStruct, isPanel }: Props) {
  const structDialog = useStructDialog()
  const { setIsOpen } = structDialog
  const struct = propStruct || structDialog.struct

  const { form, initialValues } = useStructForm(struct)

  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (!struct) return

      const newStruct = produce(struct.raw, (draft) => {
        draft.props = {
          ...draft.props,
          ...data,
        }
      })

      store.structs.updateStruct(struct.id, newStruct)
      await localDB.updateStructProps(struct.id, data)

      appEmitter.emit('REFRESH_COMMANDS')

      if (!isPanel) {
        toast.info(t`Update struct successfully`)
        setIsOpen(false)
      }
    },
    [struct, isPanel, setIsOpen],
  )

  // Setup auto-save
  useAutoSave(form, initialValues, struct, isPanel, handleSubmit)

  if (!struct) {
    return null
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex min-h-full flex-1 flex-col space-y-4"
      >
        <div className="flex-1 space-y-4">
          <FormFieldWrapper name="name" label="Name" form={form}>
            {(field) => (
              <Input
                placeholder={t`Enter name`}
                {...field}
                className="w-full"
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            name="pluralName"
            label={t`Plural name`}
            form={form}
          >
            {(field) => (
              <Input
                placeholder={t`Enter plural name`}
                {...field}
                className="w-full"
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper name="name" label={t`Color`} form={form}>
            {(field) => (
              <ColorSelector
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            name="showDetail"
            label={<Trans>Show detail panel</Trans>}
            form={form}
            className="flex w-full items-center justify-between"
          >
            {(field) => (
              <Switch
                className="data-[state=unchecked]:bg-foreground/20"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          </FormFieldWrapper>
        </div>

        {!isPanel && (
          <div className="mt-auto">
            <Button type="submit" className="w-full px-4">
              <Trans>Update</Trans>
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
