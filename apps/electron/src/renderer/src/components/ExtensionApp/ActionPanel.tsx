import { PropsWithChildren } from 'react'

interface ActionPanelProps {
  title?: string
}

export const ActionPanel = ({
  children,
}: PropsWithChildren<ActionPanelProps>) => {
  // console.log('=======children:', children)
  if (Array.isArray(children)) {
    return <div>{children}</div>
  } else {
    return <div>{children}</div>
  }
}
