import { ReactNode } from 'react'
import { Trans } from '@lingui/react'
import { Mold } from '@penx/db/client'

interface Props {
  mold: Mold
}

export function MoldName({ mold }: Props) {
  let name: ReactNode = mold.name
  if (name === 'Articles') name = <Trans id="Articles"></Trans>
  if (name === 'Notes') name = <Trans id="Notes"></Trans>
  if (name === 'Podcasts') name = <Trans id="Podcasts"></Trans>
  if (name === 'Tasks') name = <Trans id="Tasks"></Trans>
  if (name === 'Images') name = <Trans id="Images"></Trans>
  if (name === 'Bookmarks') name = <Trans id="Bookmarks"></Trans>
  if (name === 'Friends') name = <Trans id="Friends"></Trans>
  if (name === 'Projects') name = <Trans id="Projects"></Trans>
  if (name === 'Pages') name = <Trans id="Pages"></Trans>
  if (name === 'Article') name = <Trans id="Article"></Trans>
  if (name === 'Note') name = <Trans id="Note"></Trans>
  if (name === 'Podcast') name = <Trans id="Podcast"></Trans>
  if (name === 'Task') name = <Trans id="Task"></Trans>
  if (name === 'Image') name = <Trans id="Image"></Trans>
  if (name === 'Bookmark') name = <Trans id="Bookmark"></Trans>
  if (name === 'Friend') name = <Trans id="Friend"></Trans>
  if (name === 'Project') name = <Trans id="Project"></Trans>
  if (name === 'Page') name = <Trans id="Page"></Trans>
  return name
}
