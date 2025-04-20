import Markdown from 'react-markdown'
import { LayoutItem } from '@penx/types'
import remarkGfm from 'remark-gfm'
import { ContentRender } from '../ContentRender'

export function TextCard({ item }: { item: LayoutItem }) {
  if (!item.props?.text) return null
  if (typeof item.props?.text === 'string') {
    return (
      <div className="text-foreground/80 flex h-full w-full flex-col items-center p-4">
        {item?.props?.text && (
          <Markdown remarkPlugins={[remarkGfm]}>{item.props.text}</Markdown>
        )}
      </div>
    )
  }
  return (
    <div className="h-full w-full px-4 py-2">
      <ContentRender content={item.props.text} />
    </div>
  )
}
