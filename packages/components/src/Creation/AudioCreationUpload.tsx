import { forwardRef, useEffect, useRef, useState } from 'react'
import { AudioLinesIcon, ImageIcon, X } from 'lucide-react'
// @ts-ignore
import { Player } from 'shikwasa'
import { toast } from 'sonner'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useMySite } from '@penx/hooks/useMySite'
import { uploadFile } from '@penx/services/uploadFile'
import { api } from '@penx/trpc-client'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  creation: Creation
}

export const AudioCreationUpload = forwardRef<HTMLDivElement, Props>(
  function AudioCreationUpload({ creation }, ref) {
    const [value, setValue] = useState(creation?.podcast?.media || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const playerRef = useRef<any>(null)
    const { site } = useMySite()

    // TODO: hack
    const [mounted, setMounted] = useState(true)

    useEffect(() => {
      if (!value || !value.startsWith('/')) return

      playerRef.current = new Player({
        container: () => document.querySelector('.podcast-audio'),
        // fixed: {
        //   type: 'fixed',
        //   position: 'bottom',
        // },
        themeColor: 'black',
        theme: 'light',
        download: true,
        preload: 'metadata',
        audio: {
          title: creation.title,
          // artist:
          //   creation?.authors[0]?.user?.displayName ||
          //   creation?.authors[0]?.user?.name ||
          //   '',
          cover: creation.image
            ? getUrl(creation.image || '')
            : getUrl(site.logo || site.image || ''),
          // src: 'https://r2.penx.me/8283074160_460535.mp3',
          // src: 'https://v.typlog.com/sspai/8267989755_658478.mp3'
          src: getUrl(value),
        },
      })
      // @ts-ignore
      window.__PLAYER__ = playerRef.current
    }, [value])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        const src = URL.createObjectURL(file)
        setValue(src)

        const duration = await getDuration(file)

        try {
          const data = await uploadFile(file)
          const uri = data.url || data.cid || ''
          updateCreationProps(creation.id, {
            podcast: {
              ...(creation.podcast as any),
              duration,
              media: uri,
            },
          })
          setValue(data.url!)
          toast.success('Audio uploaded successfully')
        } catch (error) {
          console.log('Failed to upload file:', error)
          toast.error(extractErrorMessage(error) || 'Failed to upload audio')
        }

        setLoading(false)
      }
    }

    async function removeAudio() {
      setValue('')
      playerRef.current = null
      updateCreationProps(creation.id, {
        podcast: {},
      })
    }

    if (!mounted) return null

    if (value) {
      return (
        <div className="relative h-auto w-full space-y-2">
          <div className="podcast-audio"></div>
          <div className="text-center">
            <Button
              variant="outline-solid"
              onClick={() => {
                setMounted(false)
                removeAudio()
                setTimeout(() => {
                  setMounted(true)
                }, 10)
              }}
            >
              Reupload audio
            </Button>
          </div>
          {loading && (
            <div className="flex items-center justify-center gap-1">
              <span className="text-foreground/50 text-sm">
                Audio uploading
              </span>
              <LoadingDots className="bg-foreground/50" />
            </div>
          )}
        </div>
      )
    }

    return (
      <div ref={ref}>
        <div className="bg-accent relative flex h-[160px] w-full cursor-pointer items-center justify-center rounded-2xl">
          <div className="z-1 text-foreground/40 absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center gap-1 text-sm">
            <AudioLinesIcon size={18} />
            <div>Select audio</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          {loading && <LoadingDots />}
        </div>
      </div>
    )
  },
)

function getDuration(file: File): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(file))
    audio.addEventListener('canplaythrough', () => {
      const duration = audio.duration
      if (isNaN(duration)) {
        reject(new Error('Failed to get audio duration'))
      } else {
        resolve(duration)
      }
    })
    audio.addEventListener('error', () => {
      reject(new Error('Failed to load audio'))
    })
  })
}
