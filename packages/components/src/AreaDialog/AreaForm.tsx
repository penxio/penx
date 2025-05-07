'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { slug } from 'github-slugger'
import { toast } from 'sonner'
import { z } from 'zod'
import { FileUpload } from '@penx/components/FileUpload'
import { editorDefaultValue, isMobileApp } from '@penx/constants'
import { ChargeMode } from '@penx/db/client'
import { PlateEditor } from '@penx/editor/plate-editor'
import { useArea } from '@penx/hooks/useArea'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { useRouter } from '@penx/libs/i18n'
import { updateSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { api, trpc } from '@penx/trpc-client'
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
import { Textarea } from '@penx/uikit/textarea'
import { ToggleGroup, ToggleGroupItem } from '@penx/uikit/toggle-group'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useAreaDialog } from './useAreaDialog'

const FormSchema = z.object({
  // type: z.nativeEnum(FieldType),
  logo: z.string().optional(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  slug: z.string().optional(),
  description: z.string(),
  about: z.string().optional(),
  chargeMode: z.string().optional(),
  // price: z.string().optional(),
})

export function AreaForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, area } = useAreaDialog()

  const isEdit = !!area

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // type: field?.type || FieldType.SUBJECT,
      logo: area?.logo || '',
      name: area?.name || '',
      slug: area?.slug || '',
      description: area?.description || '',
      about: area?.about || '',
      chargeMode: area?.chargeMode || ChargeMode.PAID_MONTHLY,
    },
  })
  console.log('======form:', form.formState.errors)

  const chargeMode = form.watch('chargeMode')
  const slugValue = form.watch('slug')

  useEffect(() => {
    if (!slugValue) return
    if (slugValue === slug(slugValue)) return
    form.setValue('slug', slug(slugValue))
  }, [slugValue, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        await store.area.updateArea({
          id: area.id,
          ...data,
        })
      } else {
        const area = await store.areas.addArea({
          ...data,
          slug: uniqueId(),
        })

        store.area.set(area)
        store.creations.refetchCreations(area.id)
        store.visit.setAndSave({ activeAreaId: area.id })
        await store.panels.resetPanels()
      }

      setIsOpen(false)
      toast.success(
        isEdit ? 'Area updated successfully!' : 'Area added successfully!',
      )
    } catch (error) {
      console.log('error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isEdit && (
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans id="logo"></Trans>
                </FormLabel>
                <FileUpload {...field} />
              </FormItem>
            )}
          />
        )}

        {/* <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Area type</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="w-auto"
                  size="lg"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem className="" value={FieldType.COLUMN}>
                    <Trans id="Column"></Trans>
                  </ToggleGroupItem>

                  <ToggleGroupItem value={FieldType.BOOK} className="">
                    <Trans id="Book"></Trans>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={FieldType.SUBJECT}
                    className=""
                    disabled
                  >
                    <Trans id="Subject"></Trans>
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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

        {isEdit && (
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
        )}

        {isEdit && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>
                    <Trans id="Description"></Trans>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        {isEdit && (
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>
                    <Trans id="About"></Trans>
                  </FormLabel>
                  <FormControl>
                    <div className="border-foreground/20  h-[250px] overflow-auto rounded-lg border">
                      <PlateEditor
                        variant="default"
                        className="min-h-[240px]"
                        value={
                          field.value
                            ? JSON.parse(field.value)
                            : editorDefaultValue
                        }
                        onChange={(v) => {
                          // console.log('value:',v, JSON.stringify(v));
                          field.onChange(JSON.stringify(v))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        {/* <FormField
          control={form.control}
          name="chargeMode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Charge mode</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="w-auto"
                  size="lg"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem className="" value={ChargeMode.FREE}>
                    Free
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value={ChargeMode.PAID_ONE_TIME}
                    className=""
                  >
                    One time payment
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ChargeMode.PAID_MONTHLY}>
                    Monthly subscription
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* {!isEdit && chargeMode !== ChargeMode.FREE && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute top-2 left-3 text-foreground">
                      $
                    </span>
                    <NumberInput
                      disabled={isEdit}
                      placeholder=""
                      precision={2}
                      {...field}
                      className="w-full pl-7"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        <div className={cn(isMobileApp && 'flex justify-center')}>
          <Button
            type="submit"
            className="w-32"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>
                {isEdit ? (
                  <Trans id="Update area"></Trans>
                ) : (
                  <Trans id="Create area"></Trans>
                )}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
