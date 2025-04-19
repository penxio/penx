'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { useSession } from '@/components/session'
import { Button } from '@penx/ui/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/ui/components/form'
import { Input } from '@penx/ui/components/input'
import { Textarea } from '@penx/ui/components/textarea'
import { ToggleGroup, ToggleGroupItem } from '@penx/ui/components/toggle-group'
import { useAreaItem } from '@/hooks/useAreaItem'
import { resetPanels, updatePanels } from '@/hooks/usePanels'
import { useSite } from '@/hooks/useSite'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useRouter } from '@/lib/i18n'
import { api, trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { ChargeMode } from '@penx/db/client'
import { slug } from 'github-slugger'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAreaDialog } from './useAreaDialog'

const FormSchema = z.object({
  // type: z.nativeEnum(FieldType),
  logo: z.string().min(1, { message: 'Please upload your avatar' }),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string(),
  about: z.string().optional(),
  chargeMode: z.nativeEnum(ChargeMode).optional(),
  // price: z.string().optional(),
})

export function AreaForm() {
  const { update } = useSession()
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, area: field } = useAreaDialog()
  const { refetch: refetchItem } = useAreaItem()
  const { refetch: refetchSite } = useSite()
  const { push } = useRouter()

  const isEdit = !!field

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // type: field?.type || FieldType.SUBJECT,
      logo: field?.logo || '',
      name: field?.name || '',
      slug: field?.slug || '',
      description: field?.description || '',
      about: field?.about || '',
      chargeMode: field?.chargeMode || ChargeMode.PAID_MONTHLY,
    },
  })

  const chargeMode = form.watch('chargeMode')
  const slugValue = form.watch('slug')

  useEffect(() => {
    if (slugValue === slug(slugValue)) return
    form.setValue('slug', slug(slugValue))
  }, [slugValue, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        await api.area.updateArea.mutate({
          id: field.id,
          ...data,
        })
        await refetchSite()
        await refetchItem()
      } else {
        const field = await api.area.createArea.mutate(data)
        await refetchSite()

        await update({
          type: 'update-props',
          activeAreaId: field.id,
        })
        await resetPanels()
        push(`/~/areas/${field.id}`)
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
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>logo</Trans>
              </FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />
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
                    <Trans>Column</Trans>
                  </ToggleGroupItem>

                  <ToggleGroupItem value={FieldType.BOOK} className="">
                    <Trans>Book</Trans>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={FieldType.SUBJECT}
                    className=""
                    disabled
                  >
                    <Trans>Subject</Trans>
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
          name="description"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>
                  <Trans>Description</Trans>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>
                  <Trans>About</Trans>
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

        <div>
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
                  <Trans>Update field</Trans>
                ) : (
                  <Trans>Create field</Trans>
                )}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
