import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn, sleep } from '@penx/utils'

interface CustomImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fallbackSrc?: string
  lazy?: boolean
  placeholderSrc?: string
  style?: React.CSSProperties
}

export const ProgressiveImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  lazy = true,
  placeholderSrc,
  style = {},
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    lazy ? placeholderSrc || '' : src,
  )
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  useEffect(() => {
    if (!lazy) {
      setImgSrc(src)
      return
    }

    if (!imgRef.current) return

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImgSrc(src)
              observer.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '100px',
        },
      )
      observer.observe(imgRef.current)

      return () => {
        observer.disconnect()
      }
    } else {
      setImgSrc(src)
    }
  }, [src, lazy])

  // const containerStyle: React.CSSProperties = {
  //   position: 'relative',
  //   width,
  //   height,
  //   overflow: 'hidden',
  //   ...style,
  // }

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    display: 'block',
  }

  const { isLoading } = useQuery({
    queryKey: ['progressiveImage', src],
    queryFn: async () => {
      await sleep(0)
      return ''
    },
    staleTime: 1000 * 60 * 60,
  })

  console.log('=======imgSrc:', imgSrc)

  return (
    <img
      {...rest}
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      className={cn('object-cover', isLoading && 'hidden')}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      style={imgStyle}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}
