'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlateEditor } from '@penx/editor/plate-editor'
import { FileUpload } from '@penx/components/FileUpload'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@penx/components/NumberInput'
import { useSiteContext } from '@penx/contexts/SiteContext'
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
import { Textarea } from '@penx/uikit/ui/textarea'
import { useSite } from '@penx/hooks/useSite'
import { defaultNavLinks, editorDefaultValue } from '@penx/constants'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { NavLink, NavLinkType } from '@penx/types'
import { api, trpc } from '@penx/trpc-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { useProductDialog } from './useProductDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  description: z.string().optional(),
  details: z.any().optional(),
  image: z.any().optional(),
})

export function ProductForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, product, index } = useProductDialog()
  const { refetch } = trpc.product.list.useQuery()
  const isEdit = !!product

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isEdit ? product.name : '',
      price: isEdit ? product.price.toString() : '',
      description: isEdit ? product.description : '',
      details: isEdit ? product.details : '',
      image: isEdit ? product.image : '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      const { price, ...rest } = data
      if (isEdit) {
        await api.product.updateProduct.mutate({
          id: product.id,
          ...rest,
        })
      } else {
        await api.product.create.mutate({
          ...data,
          price: Number(data.price) * 100,
        })
      }
      await refetch()
      form.reset()
      setIsOpen(false)
      toast.success(
        isEdit
          ? 'Product updated successfully!'
          : 'Product added successfully!',
      )
    } catch (error) {
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
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
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />

        {!isEdit && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="text-foreground absolute left-3 top-2">
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
        )}

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Details</FormLabel>
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <span>{isEdit ? 'Save' : 'Add product'}</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
