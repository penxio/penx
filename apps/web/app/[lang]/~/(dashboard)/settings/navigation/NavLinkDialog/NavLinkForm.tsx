'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { defaultNavLinks } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { updateSiteState, useSite } from '@penx/hooks/useSite'
import { api } from '@penx/trpc-client'
import { NavLink, NavLinkLocation, NavLinkType } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { useNavLinkDialog } from './useNavLinkDialog'

const FormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.nativeEnum(NavLinkType),
  location: z.nativeEnum(NavLinkLocation),
  pathname: z.string(),
})

export function NavLinkForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, navLink, index } = useNavLinkDialog()
  const site = useSiteContext()
  const { refetch } = useSite()
  const navLinks = (site.navLinks || defaultNavLinks) as NavLink[]
  const isEdit = !!navLink

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: isEdit ? navLink.title : '',
      type: isEdit ? navLink.type : ('' as NavLinkType),
      location: isEdit ? navLink.location : ('' as NavLinkLocation),
      pathname: isEdit ? navLink.pathname : '',
    },
  })

  const type = form.watch('type')

  useEffect(() => {
    form.setValue('title', isEdit ? navLink.title : '')
    form.setValue('type', (isEdit ? navLink.type : '') as any)
    form.setValue('location', (isEdit ? navLink.location : '') as any)
    form.setValue('pathname', isEdit ? navLink.pathname : '')
  }, [navLink])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const newLinks = produce(navLinks, (draft) => {
        if (isEdit) {
          draft[index] = { ...navLink, ...data }
        } else {
          draft.push({ ...data, visible: true })
        }
      })
      await api.site.updateSite.mutate({
        id: site.id,
        navLinks: newLinks,
      })
      updateSiteState({ navLinks: newLinks })
      // await refetch()
      form.reset()
      setIsOpen(false)
      toast.success(<Trans id="Updated successfully!"></Trans>)
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
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Title"></Trans>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEdit && field.value === NavLinkType.BUILTIN}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={<Trans id="Select a type"></Trans>}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem disabled={!isEdit} value={NavLinkType.BUILTIN}>
                    <Trans id="Builtin"></Trans>
                  </SelectItem>
                  <SelectItem value={NavLinkType.PAGE}>Page</SelectItem>
                  <SelectItem value={NavLinkType.TAG}>Tag</SelectItem>
                  <SelectItem value={NavLinkType.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={<Trans id="Select a location"></Trans>}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NavLinkLocation.HEADER}>
                    <Trans id="Header"></Trans>
                  </SelectItem>
                  <SelectItem value={NavLinkLocation.FOOTER}>
                    <Trans id="Footer"></Trans>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pathname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Pathname</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="w-full"
                  disabled={isEdit && type === NavLinkType.BUILTIN}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <span>
              {isEdit ? <Trans id="Save"></Trans> : <Trans id="Add"></Trans>}
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
