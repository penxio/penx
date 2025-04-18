'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { isValidUUIDv4 } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'
import { setNodes } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { TCampaignElement } from '../lib'
import { CampaignCard } from './CampaignCard'

export const CampaignElement = withRef<typeof PlateElement>((props, ref) => {
  // const editor = usePlateEditor()
  const editor = useSlate()
  const { children, className, nodeProps, ...rest } = props
  const [value, setValue] = useState('')
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['campaign'],
    mutationFn: async (id: string) => {
      return await api.campaign.byId.query(id)
    },
  })

  // if (isLoading) {
  //   return (
  //     <div>
  //       <div>loading...</div>
  //     </div>
  //   )
  // }

  if (!rest.element.campaignId) {
    return (
      <PlateElement
        ref={ref}
        className={cn(
          'border-foreground/5 space-y-1 rounded-2xl border p-4',
          className,
        )}
        {...rest}
        contentEditable={false}
      >
        <div className="text-foreground/80 text-sm">Enter product ID</div>
        <div className="flex items-center gap-1">
          <Input
            placeholder="Campaign ID"
            value={value}
            onChange={(e) => setValue(e.target.value.trim())}
          />
          <Button
            disabled={isPending || !value}
            onClick={async () => {
              try {
                if (!isValidUUIDv4(value))
                  throw new Error('Invalid campaign ID')
                await mutateAsync(value)
                const path = ReactEditor.findPath(editor as any, props.element)
                setNodes<TCampaignElement>(
                  editor as any,
                  { campaignId: value },
                  { at: path },
                )
              } catch (error) {
                toast.error(
                  extractErrorMessage(error) || 'Failed to load campaign',
                )
              }
            }}
          >
            Save
          </Button>
        </div>
      </PlateElement>
    )
  }

  return (
    <PlateElement
      ref={ref}
      {...props}
      className={cn(props.className, 'flex justify-center py-2', className)}
      contentEditable={false}
    >
      <CampaignCard campaignId={props.element.campaignId as string} />
      {children}
    </PlateElement>
  )
})
