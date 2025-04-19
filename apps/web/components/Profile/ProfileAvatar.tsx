'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { useSession } from '@/components/session'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { ChevronDown, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn, getUrl } from '@penx/utils'
import { UserAvatar } from '../UserAvatar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string
  showName?: boolean
  showDropIcon?: boolean
  image?: string
  showFullAddress?: boolean
  showCopy?: boolean
}

export const ProfileAvatar = forwardRef<HTMLDivElement, Props>(
  function ProfileAvatar(
    {
      className = '',
      showName,
      showFullAddress,
      showCopy,
      showDropIcon,
      image,
      ...rest
    },
    ref,
  ) {
    const { data: session } = useSession()
    const { copy } = useCopyToClipboard()
    let name = session?.name || ''

    let src = image || session?.picture
    if (src) src = getUrl(src)

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...rest}
      >
        <UserAvatar address={name} image={src} />

        {showName && (
          <>
            <div>
              {name && <div className="text-base">{name}</div>}

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'text-sm',
                    name && 'text-foreground/60 text-xs',
                  )}
                >
                  {session?.email}
                </div>
                {showCopy && (
                  <Copy
                    size={14}
                    className="text-foreground/60 hover:text-foreground/80 cursor-pointer"
                    onClick={() => {
                      copy(session?.email || '')
                      toast.success('Email copied to clipboard')
                    }}
                  ></Copy>
                )}
              </div>
            </div>
          </>
        )}
        {showDropIcon && <ChevronDown size={14} />}
      </div>
    )
  },
)
