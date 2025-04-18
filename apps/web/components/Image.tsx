import { STATIC_URL } from '@/lib/constants'
import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

export const Image = ({ src, ...rest }: ImageProps) => {
  if (typeof src === 'string' && src.startsWith(STATIC_URL)) {
    return <NextImage src={`${basePath || ''}${src}`} {...rest} />
  }
  return <img src={`${basePath || ''}${src}`} {...rest} />
}
