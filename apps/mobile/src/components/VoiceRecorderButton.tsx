import React, { useEffect, useMemo, useRef, useState } from 'react'
import { checkAndRequestPermission } from '@/lib/checkAndRequestPermission'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { VoiceRecorder } from 'capacitor-voice-recorder'
import { AudioLinesIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { defaultEditorContent } from '@penx/constants'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { localDB } from '@penx/local-db'
import { StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'

interface Props {}

export const VoiceRecorderButton = ({}: Props) => {
  const addCreation = useAddCreation()
  const [status, setStatus] = useState<'init' | 'recording' | 'ended'>('init')
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<any>(null)

  const startTimer = () => {
    const start = Date.now()
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000))
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  const handleStart = () => {
    setStatus('recording')
    setElapsedTime(0)
    startTimer()
  }

  const handleStop = async () => {
    setStatus('init')
    stopTimer()
    const result = await VoiceRecorder.stopRecording()
    // console.log('======result:', result.value)

    const id = uniqueId()
    await localDB.voice.add({
      id,
      ...result.value,
      uploaded: false,
    })

    await addCreation({
      type: StructType.VOICE,
      content: JSON.stringify(defaultEditorContent),
      data: {
        voiceId: id,
      },
    })
  }

  return (
    <motion.div
      initial="closed"
      exit="closed"
      variants={{
        open: {
          width: 96,
          height: 36,
        },
        closed: {
          width: 36,
          height: 36,
        },
      }}
      animate={status === 'init' ? 'closed' : 'open'}
      className="text-background shadow-popover dark:bg-brand absolute left-[70px] top-[10px] flex h-[36px] items-center justify-start rounded-full bg-white"
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-center',
          status !== 'init' && 'hidden',
        )}
        onClick={async (e) => {
          // e.stopPropagation()
          const permissionGranted = await checkAndRequestPermission()
          if (!permissionGranted) {
            return
          }
          await VoiceRecorder.startRecording()
          setStatus('recording')
          handleStart()
        }}
      >
        <AudioLinesIcon size={20} className="text-foreground" />
      </div>

      <div
        className={cn(
          'text-foreground flex items-center gap-1 pr-2',
          status !== 'recording' && 'hidden',
        )}
      >
        <motion.div
          // whileTap={{ scale: 1.2 }}
          className="icon-[heroicons-solid--stop] size-[36px] text-red-500"
          onClick={handleStop}
        />
        <AnimatePresence>
          {status === 'recording' && (
            <motion.div
              initial="closed"
              exit="closed"
              variants={{
                open: {
                  scaleX: 1,
                  opacity: 1,
                  transition: {
                    type: 'keyframes',
                    // ease: 'easeOut',
                    // duration: 0.25,
                  },
                },
                closed: {
                  scaleX: 0,
                  // opacity: 0,
                  transition: {
                    // type: 'keyframes',
                  },
                },
              }}
              animate={status === 'recording' ? 'open' : 'closed'}
              className="text-foreground inline-flex w-auto text-base"
            >
              {formatTime(elapsedTime)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return (
    (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs
  )
}
