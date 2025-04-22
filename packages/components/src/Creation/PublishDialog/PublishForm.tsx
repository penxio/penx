'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react'
import { GateType } from '@prisma/client'
import { DialogClose } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useSpaceContext } from '@penx/components/SpaceContext'
import { BUILTIN_PAGE_SLUGS, editorDefaultValue } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { PlateEditor } from '@penx/editor/plate-editor'
import {
  PublishPostFormSchema,
  usePublishPost,
} from '@penx/hooks/usePublishPost'
import { useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { Calendar } from '@penx/uikit/ui/calendar'
import { DialogHeader, DialogTitle } from '@penx/uikit/ui/dialog'
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
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/ui/popover'
import { Switch } from '@penx/uikit/ui/switch'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { Authors } from '../Authors'
import { usePanelCreationContext } from '../PanelCreationProvider'
import { usePublishDialog } from './usePublishDialog'

export function PublishForm() {
  const { setIsOpen } = usePublishDialog()
  const creation = usePanelCreationContext()
  const { spaceId, ...site } = useSiteContext()
  const { data: session } = useSession()
  const { isLoading, publishPost } = usePublishPost()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof PublishPostFormSchema>>({
    resolver: zodResolver(PublishPostFormSchema),
    defaultValues: {
      slug: creation?.slug ? `/${creation?.slug}` : '',
      gateType: creation?.gateType || GateType.FREE,
      collectible: creation?.collectible || false,
      delivered: creation?.delivered || false,
      publishedAt: creation?.publishedAt
        ? new Date(creation?.publishedAt)
        : new Date(),
    },
  })

  async function onSubmit(data: z.infer<typeof PublishPostFormSchema>) {
    const opt = {
      ...data,
      slug: data.slug.replace(/^\/|\/$/g, ''),
    }

    try {
      await publishPost(creation, opt)
      // setPost({
      //   ...post,
      //   status: PostStatus.PUBLISHED,
      //   ...opt,
      // })
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>
          <Trans id="Publish your creation"></Trans>
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Slug"></Trans>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="w-full"
                  disabled={BUILTIN_PAGE_SLUGS.includes(creation.slug)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <>
          <FormField
            control={form.control}
            name="gateType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  <Trans id="Access control"></Trans>
                </FormLabel>
                <FormDescription>
                  <Trans id="Gate this post, config who can read this post."></Trans>
                </FormDescription>
                <FormControl>
                  <GateTypeSelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
            <FormField
              control={form.control}
              name="collectible"
              render={({ field }) => (
                <FormItem className="w-full flex items-center">
                  <FormLabel htmlFor="post-collectible">collectible</FormLabel>
                  <FormControl>
                    <Switch
                      id="post-collectible"
                      checked={field.value}
                      disabled={!spaceId}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

          <FormField
            control={form.control}
            name="delivered"
            render={({ field }) => (
              <div>
                <FormItem className="flex w-full items-center">
                  <div className="flex items-center gap-2">
                    <FormLabel htmlFor="post-delivered">
                      <Trans id="Deliver your newsletter"></Trans>
                    </FormLabel>
                    <Badge
                      size="sm"
                      className="h-6 cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      <Trans id="Upgrade"></Trans>
                    </Badge>
                  </div>
                  <FormControl>
                    {creation.delivered ? (
                      <div className="text-muted-foreground text-sm">
                        <Trans id="Upgrade"></Trans>
                        Already sent
                      </div>
                    ) : (
                      <Switch
                        id="post-delivered"
                        disabled={session?.isFree}
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value)
                        }}
                      />
                    )}
                  </FormControl>

                  <FormMessage />
                </FormItem>
                <div className="text-foreground/60 text-xs">
                  {creation.delivered
                    ? 'This newsletter has been sent to subscribers.'
                    : 'Send your newsletter to subscribers.'}
                </div>
              </div>
            )}
          />
        </>

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel htmlFor="">Publish date</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex justify-start gap-1 rounded-md px-3 text-xs',
                          !field.value && 'text-muted-foreground',
                        )}
                        onClick={() => setOpen(!open)}
                      >
                        <CalendarIcon size={14} />
                        {field.value ? (
                          <span>{format(field.value, 'PPP')}</span>
                        ) : (
                          <span>
                            <Trans id="Pick a date"></Trans>
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={async (d) => {
                          setOpen(false)
                          if (d) {
                            field.onChange(d!)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* <FormField
          control={form.control}
          name="gateType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                <Trans id="Authors"></Trans>
              </FormLabel>
              <FormControl>
                <Authors creation={creation} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">
              <Trans id="Cancel"></Trans>
            </Button>
          </DialogClose>
          <Button type="submit" className="w-24" disabled={isLoading}>
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>
                <Trans id="Publish"></Trans>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface GateTypeSelectProps {
  value: GateType
  onChange: (value: GateType) => void
}

function GateTypeSelect({ value, onChange }: GateTypeSelectProps) {
  return (
    <div className="flex gap-2">
      <GateTypeItem
        selected={value === GateType.FREE}
        title="Free"
        description="Any one can read this post"
        onClick={() => onChange(GateType.FREE)}
      />
      <GateTypeItem
        selected={value === GateType.PAID}
        title="Paid"
        description="Member or collector can read this post"
        onClick={() => onChange(GateType.PAID)}
      />
    </div>
  )
}

interface GateItemTypeProps {
  selected?: boolean
  title: string
  description: string
  onClick: () => void
}

function GateTypeItem({
  selected,
  title,
  description,
  onClick,
}: GateItemTypeProps) {
  return (
    <div
      className={cn(
        'flex-1 cursor-pointer rounded-xl border-2 p-3',
        selected ? 'border-primary' : 'border-secondary',
      )}
      onClick={() => onClick?.()}
    >
      <div className="text-base font-medium">{title}</div>
      <div className="text-foreground/60 text-xs">{description}</div>
    </div>
  )
}
