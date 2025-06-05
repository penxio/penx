import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { AudioLinesIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Creation } from '@penx/domain'
import { localDB } from '@penx/local-db'
import { IVoice } from '@penx/model-type'
import { useSession } from '@penx/session'
import { getUrl } from '@penx/utils'
import { base64StringToFile } from '@penx/utils/base64StringToFile'
import { getAudioFileFromUrl } from './getAudioFileFromUrl'
import { uploadAudio } from './uploadAudio'

export interface RecordingData {
  recordDataBase64?: string // Base64String
  msDuration: number
  mimeType: string
  uri?: string
}

interface Props {
  creation: Creation
}

export const VoiceContent = ({ creation }: Props) => {
  const { session } = useSession()
  const { isLoading, data: voice } = useQuery({
    queryKey: ['voice', creation.id],
    queryFn: async () => {
      const result = await localDB.voice.get(creation.data['voiceId'])
      return result ? result : null
    },
  })

  const [duration, setDuration] = useState('')

  useEffect(() => {
    if (!voice || !session) return
    tryToUploadVoice(creation, voice)
  }, [voice, creation, session])

  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      setDuration(audioRef.current?.duration.toString())
    }
  }, [audioRef.current])

  const getAudioSrc = () => {
    if (voice) {
      const { recordDataBase64, mimeType, uri } = voice!
      if (recordDataBase64) {
        return `data:${mimeType};base64,${recordDataBase64}`
      } else if (uri) {
        return uri
      }
    } else {
      return creation.audioUrl
    }
  }

  const time = useMemo(() => {
    if (voice?.msDuration) {
      return (voice?.msDuration || 0) / 1000
    }
    if (duration) return Number(duration)
    return 0
  }, [duration, voice])

  const handlePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch((err) => {
        console.error('播放失败，可能需要用户交互:', err)
      })
  }

  const handlePause = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }

  if (isLoading) return null

  const audioSrc = getAudioSrc()
  console.log('====audioSrc:', audioSrc)

  if (!audioSrc) {
    return (
      <div>
        <Trans>No voice data!</Trans>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-2"
      style={
        {
          // width: calcAudioBubbleWidth(recording.msDuration / 1000),
        }
      }
      onClick={async (e) => {
        e.stopPropagation()
        handlePlay()
        console.log('click......:', creation)
        const file = await getAudioFileFromUrl(
          'https://pub-52a4c119f0b8428499eda7d07a9bb005.r2.dev/baf14ce45889ca6979ecc56bc7be50c1a36df6bf9623eb7faa47ee9208b7ed48.mp3',
          // 'https://static.penx.me/audios/baf14ce45889ca6979ecc56bc7be50c1a36df6bf9623eb7faa47ee9208b7ed48.aac',
        )

        console.log('======file:', file)

        const formData = new FormData()
        formData.append('file', file)
        try {
          const res = await fetch('/transcribe', {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()
          if (res.ok) {
            console.log('=====data:', data)
          } else {
            alert(data.error || '转录失败')
          }
        } catch (err) {
          alert('请求出错')
        }
      }}
    >
      <div className="flex h-8 items-center justify-center">
        {isPlaying && (
          <motion.div
            whileTap={{ scale: 1.2 }}
            className="icon-[heroicons-solid--stop] size-7"
            onClick={(e) => {
              e.stopPropagation()
              handlePause()
            }}
          />
        )}
        {!isPlaying && (
          <div className="bg-foreground/10 flex size-6 items-center justify-center rounded-full">
            <span className="icon-[heroicons--play-20-solid] size-3" />
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={(e: any) => {
          e.target?.duration && setDuration(e.target?.duration)
        }}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      {/* <div>{audioRef.current?.duration}</div> */}
      <div>{time.toFixed(1)} s</div>
    </div>
  )
}

export function calcAudioBubbleWidth(
  durationSec: number,
  minWidth = 20,
  maxWidth = 80,
  maxDuration = 60,
): string {
  const sec = Math.max(1, durationSec)
  const effectiveSec = Math.min(sec, maxDuration)
  const width =
    minWidth + ((maxWidth - minWidth) * (effectiveSec - 1)) / (maxDuration - 1)
  return `${width}vw`
}

async function tryToUploadVoice(creation: Creation, voice: IVoice) {
  if (voice.uploaded) return

  const file = base64StringToFile(
    voice.recordDataBase64!,
    voice.mimeType.split(';')[0],
  )

  try {
    const data = await uploadAudio(file)
    await localDB.voice.update(voice.id, { uploaded: true })
    await localDB.updateCreationProps(creation.id, {
      data: {
        ...creation.data,
        url: data.url,
      },
    })
  } catch (error) {
    console.log('upload voice error:', error)
  }
}
