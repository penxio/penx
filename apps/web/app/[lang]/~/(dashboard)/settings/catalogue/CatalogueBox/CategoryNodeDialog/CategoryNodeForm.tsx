'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@penx/uikit/loading-dots'
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
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { CatalogueNodeType } from '@penx/model-type'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCatalogue } from '../hooks/useCatalogue'
import { useCategoryNodeDialog } from './useCategoryNodeDialog'

const FormSchema = z.object({
  title: z.string().min(1),
})

interface Props {}

export function CategoryNodeForm({}: Props) {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, parentId, node } = useCategoryNodeDialog()
  const { addNode, updateTitle } = useCatalogue()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: node?.title || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      if (node) {
        await updateTitle(node!.id, data.title)
      } else {
        await addNode(
          {
            title: data.title,
            type: CatalogueNodeType.CATEGORY,
          },
          parentId,
        )
      }
      setIsOpen(false)
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingDots /> : <p>Confirm</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
