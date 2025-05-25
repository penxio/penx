import React, { useRef, useState } from 'react'
import { AudioLinesIcon } from 'lucide-react'
import { motion } from 'motion/react'

export interface RecordingData {
  recordDataBase64?: string // Base64String
  msDuration: number
  mimeType: string
  uri?: string
}

interface AudioPlayerProps {
  recording: RecordingData
}

export const VoiceContent: React.FC<AudioPlayerProps> = ({ recording }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getAudioSrc = () => {
    const { recordDataBase64, mimeType, uri } = recording
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

  const audioSrc = getAudioSrc()

  if (!audioSrc) {
    return <div>No voice data!</div>
  }

  return (
    <div
      className="flex items-center gap-2"
      style={{
        width: calcAudioBubbleWidth(recording.msDuration / 1000),
      }}
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
      <div>{(recording.msDuration / 1000).toFixed(1)} s</div>
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
