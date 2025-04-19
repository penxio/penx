'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { addCreation, getFields } from '@/lib/api'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { getUrl } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { toast } from 'sonner'
import { z } from 'zod'
import { CreationType } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { Button } from '@penx/uikit/ui/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import {
  Form,
  FormControl,
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
import { Textarea } from '@penx/uikit/ui/textarea'
import { useFields } from '../hooks/useFields'
import { Tags } from './Tags'

const FIELD_ID = 'CURRENT_FIELD_ID'

const FormSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  avatar: z.string().optional(),
  fieldId: z.string(),
  tags: z.array(z.any()),
  isPublic: z.boolean().optional(),
})

export function AddBookmarkForm() {
  const [isLoading, setLoading] = useState(false)
  const { data = [] } = useFields()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      avatar: '',
      tags: [],
      isPublic: false,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await addCreation({
        title: data.title,
        description: data.description,
        image: data.avatar,
        props: {
          url: data.url,
        },
        type: CreationType.BOOKMARK,
        tagIds: data.tags.map((tag) => tag.id),
        fieldId: data.fieldId,
      })
      await set(FIELD_ID, data.fieldId)
      window.close()
    } catch (error) {
      console.log('======error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  async function initFormValues() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (tab) {
      console.log('tab=======:', tab)
      form.setValue('url', tab.url)
      form.setValue('title', tab.title)
      form.setValue('avatar', tab.favIconUrl)
    }
  }

  useEffect(() => {
    initFormValues()
  }, [form])

  async function initFieldId() {
    if (data.length > 0) {
      let fieldId = await get(FIELD_ID)

      if (!data.some((f) => f.id === fieldId)) {
        const field = data.find((field) => field.isGenesis) || data[0]
        fieldId = field.id
      }

      setTimeout(() => {
        form.setValue('fieldId', fieldId)
      }, 0)
    }
  }

  useEffect(() => {
    initFieldId()
  }, [form, data])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 text-sm"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs">Link</FormLabel>
              <FormControl>
                <Input size="sm" placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs">Title</FormLabel>
              <FormControl>
                <Input size="sm" placeholder="" {...field} className="w-full" />
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
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs">Tags</FormLabel>
              <FormControl>
                <Tags value={field.value} onChange={(v) => field.onChange(v)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fieldId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      <div className="flex items-center gap-1">
                        <Avatar className="size-6">
                          <AvatarImage src={getUrl(field.logo || '')} />
                          <AvatarFallback>
                            {field.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{field.name}</span>
                      </div>
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
          name="isPublic"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="is-link-public"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v)}
                  />
                  <FormLabel htmlFor="is-link-public" className="text-xs">
                    Is public to anyone?
                  </FormLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <LoadingDots /> : <div>Save</div>}
        </Button>
      </form>
    </Form>
  )
}
