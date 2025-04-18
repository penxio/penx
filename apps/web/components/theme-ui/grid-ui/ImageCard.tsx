import { Image } from '@/components/Image'
import { LayoutItem, Site } from '@/lib/theme.types'
import { getUrl } from '@/lib/utils'

export function ImageCard({ item }: { item: LayoutItem }) {
  return (
    <Image
      width={500}
      height={500}
      alt=""
      src={getUrl(item.props?.url || '')}
      className="h-auto w-auto object-cover transition-all hover:scale-110"
    />
  )
}
