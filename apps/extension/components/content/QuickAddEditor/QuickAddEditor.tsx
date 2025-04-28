import React, { forwardRef, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useLocalFields } from '@/hooks/useLocalFields'
import { BACKGROUND_EVENTS } from '@/lib/constants'
import { SUCCESS } from '@/lib/helper'
import { cn, getUrl } from '@/lib/utils'
import { PopoverClose, Portal } from '@radix-ui/react-popover'
import { SendHorizontal, X } from 'lucide-react'
import { motion, useMotionValue } from 'motion/react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/checkbox'
import { Label } from '@penx/uikit/label'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { useAppType } from '../hooks/useAppType'
import { useAreas } from '../hooks/useAreas'
import { useNote } from '../hooks/useNote'

// import { BACKGROUND_EVENTS } from '@penx/constants'
BACKGROUND_EVENTS

const MotionBox = motion.div

interface Props {
  x?: number
  y?: number
}

export const QuickAddEditor = forwardRef<HTMLDivElement, Props>(
  function QuickAddEditor({ x, y }, propsRef) {
    const { destroy } = useAppType()
    const { note, setNote } = useNote()
    const [loading, setLoading] = useState(false)
    const [tips, setTips] = useState('')
    const { fields = [] } = useLocalFields()
    const [areaId, setAreaId] = useState('')

    const onSubmit = async () => {
      if (!note.trim()) {
        setTips('Please write something...')
        return
      }
      setLoading(true)

      const data = await chrome.runtime.sendMessage({
        type: BACKGROUND_EVENTS.SUBMIT_CONTENT,
        payload: {
          content: note,
          areaId: areaId,
        },
      })

      if (data?.code === SUCCESS) {
        setNote('')
        destroy()
      } else {
        setLoading(false)
        alert('Add note failed. Please try again.')
      }
    }

    const boxWidth = 360
    const boxHeight = 200

    const posX = x || window.innerWidth / 2 - boxWidth / 2
    const posY = y || window.innerHeight * 0.2

    // const posX = window.innerWidth / 2 - boxWidth / 2
    // const posY = window.innerHeight * 0.2
    // console.log('posX:', posX, 'posY:', posY)
    const containerX = useMotionValue(0)
    const containerY = useMotionValue(0)

    const field = fields.find((field) => field.id === areaId)

    useEffect(() => {
      if (!areaId) {
        setAreaId(fields[0]?.id)
      }
    }, [fields])

    return (
      <MotionBox
        className="bg-background ring-foreground/5 fixed flex min-h-72 w-96 flex-col overflow-hidden rounded-xl shadow-2xl dark:bg-[#151515]"
        // minH={boxHeight}
        style={{
          zIndex: 500000,
          minWidth: boxWidth,
          x: containerX,
          y: containerY,
          // left: posX,
          // top: posY,

          right: 50,
          top: 100,
        }}
      >
        <MotionBox
          className="flex h-10 cursor-move items-center justify-between px-4"
          onPan={(e, info) => {
            containerX.set(containerX.get() + info.delta.x)
            containerY.set(containerY.get() + info.delta.y)
          }}
        >
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">Add note</div>
            {tips && <div className="text-xs text-red-500">{tips}</div>}
          </div>

          <div
            className="text-foreground/40 flex h-7 w-7 cursor-pointer items-center justify-center"
            onClick={() => destroy()}
          >
            <X size={20} />
          </div>
        </MotionBox>

        <div className="flex flex-1 flex-col px-4 py-1">
          <TextareaAutosize
            className="dark:placeholder-text-600 placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-base focus:outline-none focus:ring-0"
            placeholder="Write a note..."
            value={note}
            minRows={8}
            autoFocus
            onChange={(e) => {
              setNote(e.target.value)
              setTips('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                e.preventDefault()
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-1">
            <div className="text-foreground/50 text-xs">Save to</div>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    'hover:bg-foreground/7 bg-foreground/5 line-clamp-1 flex cursor-pointer items-center gap-1 rounded-full px-2 py-1',
                  )}
                >
                  {field ? (
                    <>
                      <Avatar className="size-5">
                        <AvatarImage src={getUrl(field?.logo || '')} />
                        <AvatarFallback>
                          {field?.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{field?.name}</span>
                    </>
                  ) : (
                    <span className="text-sm">Select an area</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                isPortal={false}
                className="flex w-48 flex-col gap-1 p-1"
              >
                {fields.map((field) => (
                  <PopoverClose key={field.id}>
                    <div
                      className={cn(
                        'hover:bg-foreground/5 flex cursor-pointer items-center gap-1 rounded px-2 py-2',
                        areaId === field.id && 'bg-foreground/5',
                      )}
                      onClick={() => setAreaId(field.id)}
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={getUrl(field.logo || '')} />
                        <AvatarFallback>
                          {field.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{field.name}</span>
                    </div>
                  </PopoverClose>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          {/* <div className="flex items-center gap-1">
            <Checkbox id="penx-note-publish" />
            <Label htmlFor="penx-note-publish">Publish directly?</Label>
          </div> */}
          <Button
            size="sm"
            disabled={loading}
            className="flex w-20 gap-1 rounded-xl"
            onClick={() => onSubmit()}
          >
            {loading && <LoadingDots className="bg-background" />}
            {!loading && (
              <>
                <SendHorizontal size={16} />
                <div className="text-sm">Send</div>
              </>
            )}
          </Button>
        </div>
      </MotionBox>
    )
  },
)
