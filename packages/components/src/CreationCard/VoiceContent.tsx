import React, { useEffect, useRef, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { AudioLinesIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Creation } from '@penx/domain'
import { localDB } from '@penx/local-db'
import { IVoice } from '@penx/model-type'
import { base64StringToFile } from '@penx/utils/base64StringToFile'
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
  const { isLoading, data: voice } = useQuery({
    queryKey: ['voice', creation.id],
    queryFn: async () => {
      return await localDB.voice.get(creation.data['voiceId'])
    },
  })

  useEffect(() => {
    if (!voice) return
    tryToUploadVoice(creation, voice)
  }, [voice, creation])

  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getAudioSrc = () => {
    if (!voice) return null
    const { recordDataBase64, mimeType, uri } = voice!
    if (recordDataBase64) {
      return `data:${mimeType};base64,${recordDataBase64}`
    } else if (uri) {
      return uri
    }

    return null
  }

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
      onClick={handlePlay}
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
        {!isPlaying && <AudioLinesIcon size={20} />}
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      <div>{(voice!.msDuration / 1000).toFixed(1)} s</div>
      <div>{voice!.mimeType} </div>
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
