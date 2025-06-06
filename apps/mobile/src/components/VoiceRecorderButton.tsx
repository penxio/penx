import React, { useEffect, useMemo, useRef, useState } from 'react'
import { checkAndRequestPermission } from '@/lib/checkAndRequestPermission'
import { isIOS } from '@/lib/utils'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'
import { PluginListenerHandle } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { Trans, useLingui } from '@lingui/react/macro'
import { VoiceRecorder } from 'capacitor-voice-recorder'
import {
  AudioLinesIcon,
  CircleStopIcon,
  Maximize2Icon,
  PauseIcon,
  XIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { defaultEditorContent, isMobileApp } from '@penx/constants'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { localDB } from '@penx/local-db'
import { StructType } from '@penx/types'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { stringToDoc } from '@penx/utils/editorHelper'
import { Drawer } from './Drawer'

interface Props {}

export const VoiceRecorderButton = ({}: Props) => {
  const { i18n } = useLingui()
  const [isOpen, setIsOpen] = useState(false)
  const addCreation = useAddCreation()
  const [status, setStatus] = useState<
    'init' | 'paused' | 'recording' | 'ended'
  >('init')
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<any>(null)
  const listenerRef = useRef<PluginListenerHandle>(null)

  const [text, setText] = useState('')

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

  const handlePause = () => {
    if (status === 'paused') return

    clearInterval(timerRef.current)
    setStatus('paused')
  }

  const handleResume = () => {
    if (status === 'recording') return

    console.log('=======status:', status)

    setStatus('recording')

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
  }

  const handleCancel = async () => {
    if (isIOS) {
      try {
        const available = await SpeechRecognition.available()
        if (available) {
          await SpeechRecognition.stop()
        }
      } catch (error) {}
      listenerRef.current?.remove()
      listenerRef.current = null
    }

    await VoiceRecorder.stopRecording()

    setText('')
    setStatus('init')
    setIsOpen(false)
    stopTimer()
  }

  const handleStop = async () => {
    if (isIOS) {
      try {
        const available = await SpeechRecognition.available()
        if (available) {
          await SpeechRecognition.stop()
        }
      } catch (error) {}
      listenerRef.current?.remove()
      listenerRef.current = null
    }

    const recordingData = await VoiceRecorder.stopRecording()
    // console.log('======result:', recordingData.value)

    const id = uniqueId()
    await localDB.voice.add({
      id,
      ...recordingData.value,
      uploaded: false,
    })

    await addCreation({
      type: StructType.VOICE,
      content: text
        ? JSON.stringify(stringToDoc(text))
        : JSON.stringify(defaultEditorContent),
      data: {
        voiceId: id,
        duration: recordingData.value.msDuration,
      },
    })

    setText('')
    setStatus('init')
    setIsOpen(false)
    stopTimer()
  }

  return (
    <>
      <motion.div
        initial="closed"
        exit="closed"
        variants={{
          open: {
            // width: 'auto',
            // minWidth: 36,
            width: 130,
            height: 36,
            transition: {
              type: 'keyframes',
            },
          },
          closed: {
            minWidth: 36,
            width: 36,
            height: 36,
            transition: {
              type: 'keyframes',
            },
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

            if (isIOS) {
              try {
                const available = await SpeechRecognition.available()

                if (available) {
                  const status = await SpeechRecognition.checkPermissions()
                  console.log('======= SpeechRecognition permission:', status)

                  await SpeechRecognition.requestPermissions()

                  if (status.speechRecognition !== 'granted') {
                    const { speechRecognition } =
                      await SpeechRecognition.requestPermissions()
                    console.log('====speechRecognition:', speechRecognition)
                    if (speechRecognition !== 'granted') return
                  }

                  // console.log('=====langs:', langs)

                  // try {
                  //   await SpeechRecognition.stop()

                  //   await SpeechRecognition.removeAllListeners()
                  // } catch {}

                  const getLang = async () => {
                    let lang = 'en-US'
                    let { value } = await getDeviceLanguage()
                    const { languages } =
                      await SpeechRecognition.getSupportedLanguages()

                    if (languages.includes(value)) return value
                    if (languages.includes(i18n.locale)) return i18n.locale

                    if (lang.startsWith('zh-')) lang = 'zh-CN'
                    if (lang === 'zh-Hans-CN') lang = 'zh-CN'
                    return lang
                  }

                  await SpeechRecognition.start({
                    language: await getLang(),
                    partialResults: true,
                    popup: false,
                    // maxResults: 2,
                  })

                  listenerRef.current = await SpeechRecognition.addListener(
                    'partialResults',
                    (event) => {
                      const results = event.matches
                      console.log('=======results:', results)
                      setText(results.join(' '))
                    },
                  )

                  console.log('======status:', status)

                  // console.log('=====rec.matches:', rec.matches)
                }
              } catch (error) {
                console.log('=====error:', error)
              }
            }

            setStatus('recording')
            handleStart()
          }}
        >
          <AudioLinesIcon size={20} className="text-foreground" />
        </div>

        <div
          className={cn(
            'text-foreground flex flex-1 items-center justify-between gap-0.5',
            status === 'init' && 'hidden',
          )}
        >
          <motion.div
            // whileTap={{ scale: 1.2 }}
            className="icon-[heroicons-solid--stop] size-[36px] text-red-500"
            onClick={handleStop}
          />

          <AnimatePresence>
            {status !== 'init' && (
              <motion.div
                initial="closed"
                exit="closed"
                variants={{
                  open: {
                    scale: 1,
                    opacity: 1,
                  },
                  closed: {
                    scale: 0,
                    opacity: 0,
                  },
                }}
                // animate={status !== 'init' ? 'closed' : 'open'}
                className="text-foreground/70 shadow-card flex size-[28px] items-center justify-center rounded-full"
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                <Maximize2Icon size={16} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {status !== 'init' && (
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
                // animate={status === 'init' ? 'closed' : 'open'}
                className="text-foreground inline-flex w-auto flex-1 items-center justify-center gap-1 pr-2 text-base"
              >
                <span className="font-bold">{formatTime(elapsedTime)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Drawer
        open={isOpen}
        setOpen={setIsOpen}
        className="min-h-[40vh] bg-neutral-100 dark:bg-neutral-800"
      >
        <div className="text-foreground flex h-full flex-1 flex-col justify-between">
          <div className="flex flex-1 items-center justify-center">
            <div className="">
              <span className="text-5xl font-bold">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
          <div className="mx-[10vw] flex items-center justify-between">
            <div
              className="bg-background shadow-card flex size-12 items-center justify-center rounded-full"
              onClick={handleCancel}
            >
              <XIcon size={28} />
            </div>

            <div
              className="bg-background shadow-card flex size-16 items-center justify-center rounded-full"
              onClick={handleStop}
            >
              <span className="icon-[heroicons--stop-solid] size-10 text-red-500"></span>
            </div>
            <div
              className="bg-background shadow-card flex size-12 items-center justify-center rounded-full"
              onClick={() => {
                console.log('=====status:', status)

                if (status === 'paused') {
                  console.log('handleResume....')
                  handleResume()
                } else {
                  handlePause()
                }
              }}
            >
              {status === 'paused' && (
                <span className="icon-[heroicons--play-20-solid] size-7" />
              )}

              {status === 'recording' && (
                <span className="icon-[line-md--pause] size-7" />
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return (
    (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs
  )
}

const getDeviceLanguage = async () => {
  // 获取当前设备的语言代码（两字符语言码，如 "en", "zh"）
  const languageCode = await Device.getLanguageCode()
  console.log('Language Code:', languageCode.value)

  // 获取当前设备的完整语言标签（IETF BCP 47 格式，如 "en-US", "zh-CN"）
  const languageTag = await Device.getLanguageTag()
  console.log('Language Tag:', languageTag.value)
  return languageTag
}
