import React, { forwardRef, useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useLocalAreas } from '@/hooks/useLocalAreas'
import { BACKGROUND_EVENTS } from '@/lib/constants'
import { SUCCESS } from '@/lib/helper'
import { cn, getUrl } from '@/lib/utils'
import { PopoverClose, Portal } from '@radix-ui/react-popover'
import { SendHorizontal, X } from 'lucide-react'
import { motion, useMotionValue } from 'motion/react'
import { Panel } from '@penx/panel-app/components/Panel/Panel'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { Checkbox } from '@penx/uikit/checkbox'
import { Label } from '@penx/uikit/label'
import { LoadingDots } from '@penx/uikit/loading-dots'
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
    const { data: areas = [] } = useLocalAreas()
    const [areaId, setAreaId] = useState('')

    const onSubmit = async () => {
      if (!note.trim()) {
        setTips('Please write something...')
        return
      }
      setLoading(true)

      const area = areas.find((field) => field.id === areaId)!

      const data = await chrome.runtime.sendMessage({
        type: BACKGROUND_EVENTS.SUBMIT_CONTENT,
        payload: {
          content: note,
          area: area,
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

    const boxWidth = 760
    const boxHeight = 200

    const posX = x || window.innerWidth / 2 - boxWidth / 2
    const posY = y || window.innerHeight * 0.2

    // const posX = window.innerWidth / 2 - boxWidth / 2
    // const posY = window.innerHeight * 0.2
    // console.log('posX:', posX, 'posY:', posY)
    const containerX = useMotionValue(0)
    const containerY = useMotionValue(0)

    const area = areas.find((field) => field.id === areaId)

    useEffect(() => {
      if (!areas?.length) return
      if (!areaId) {
        setAreaId(areas[0]?.id)
      }
    }, [areas])

    return (
      <MotionBox
        className="bg-background ring-foreground/5 fixed flex min-h-72 w-96 flex-col overflow-hidden rounded-xl shadow-2xl dark:bg-[#151515]"
        // minH={boxHeight}
        style={{
          zIndex: 500000,
          minWidth: boxWidth,
          height: 400,
          x: containerX,
          y: containerY,
          // left: posX,
          // top: posY,

          right: 50,
          top: 100,
        }}
      >
        <MotionBox
          className="relative flex h-10 cursor-move items-center justify-between px-4"
          onPan={(e, info) => {
            containerX.set(containerX.get() + info.delta.x)
            containerY.set(containerY.get() + info.delta.y)
          }}
        >
          {/* <div>Hello</div> */}
          {/* <div>l1234</div> */}
        </MotionBox>

        <Panel />
      </MotionBox>
    )
  },
)
