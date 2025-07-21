import { BaseActionProps } from '../types'
import { ListActionItem } from './ListActionItem'

interface OpenInBrowserProps extends BaseActionProps {
  url: string
}
export function OpenInBrowser({
  url,
  title = 'Open in Browser',
  shortcut,
  icon = { name: 'lucide--globe' },
}: OpenInBrowserProps) {
  return (
    <ListActionItem
      shortcut={shortcut}
      icon={icon}
      onSelect={() => {
        //
      }}
    >
      {title}
    </ListActionItem>
  )
}
