'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addCreation, getAreas } from '@/lib/api'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { getUrl } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import { toast } from 'sonner'
import { z } from 'zod'
import { editorDefaultValue } from '@penx/constants'
import { CommentStatus } from '@penx/db/client'
import { useAreas } from '@penx/hooks/useAreas'
import { localDB } from '@penx/local-db'
import { ICreation, ISite } from '@penx/model-type'
import { siteAtom, store } from '@penx/store'
import { CreationStatus, CreationType, GateType } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { Textarea } from '@penx/uikit/textarea'
import { uniqueId } from '@penx/unique-id'
import { Tags } from './Tags'

const AREA_ID = 'CURRENT_AREA_ID'

const FormSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  avatar: z.string().optional(),
  areaId: z.string(),
  tags: z.array(z.any()),
  isPublic: z.boolean().optional(),
})

export function AddBookmarkForm() {
  const [isLoading, setLoading] = useState(false)
  const { areas } = useAreas()

  console.log('==========areas:', areas)

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
    const site = store.site.get()
    const structs = store.structs.get()
    const struct = structs.find((struct) => struct.type === CreationType.BOOKMARK)!

    try {
      setLoading(true)
      const creation: ICreation = {
        id: uniqueId(),
        slug: uniqueId(),
        structId: struct.id,
        title: data.title || '',
        description: data.description,
        content: JSON.stringify(editorDefaultValue),
        image: data.avatar,
        props: {
          url: data.url,
        },
        type: CreationType.BOOKMARK,
        areaId: data.areaId,
        siteId: struct.siteId,
        icon: '',
        podcast: {},
        i18n: {},
        userId: site.userId,
        gateType: GateType.FREE,
        status: CreationStatus.DRAFT,
        commentStatus: CommentStatus.OPEN,
        featured: false,
        collectible: false,
        isJournal: false,
        isPopular: false,
        checked: false,
        delivered: false,
        commentCount: 0,
        cid: '',
        openedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await localDB.addCreation(creation)
      // await addCreation({
      //   title: data.title,
      //   description: data.description,
      //   image: data.avatar,
      //   props: {
      //     url: data.url,
      //   },
      //   type: CreationType.BOOKMARK,
      //   tagIds: data.tags.map((tag) => tag.id),
      //   areaId: data.areaId,
      // })
      await set(AREA_ID, data.areaId)
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

  async function initAreaId() {
    if (areas.length > 0) {
      let areaId = await get(AREA_ID)

      if (!areas.some((f) => f.id === areaId)) {
        const field = areas.find((field) => field.isGenesis) || areas[0]
        areaId = field.id
      }

      setTimeout(() => {
        form.setValue('areaId', areaId)
      }, 0)
    }
  }

  useEffect(() => {
    initAreaId()
  }, [form, areas])

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

        {/* <FormField
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
        /> */}

        {/* <FormField
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
        /> */}
        <FormField
          control={form.control}
          name="areaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {areas.map((field) => (
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

        {/* <FormField
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
        /> */}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <LoadingDots className="bg-background" />
          ) : (
            <div>Save</div>
          )}
        </Button>
      </form>
    </Form>
  )
}
