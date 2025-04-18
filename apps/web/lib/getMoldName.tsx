import { ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import { Mold } from '@penx/db/client'

export function getMoldName(mold: Mold): ReactNode {
  let name: ReactNode = mold.name
  if (name === 'Articles') name = <Trans>Articles</Trans>
  if (name === 'Notes') name = <Trans>Notes</Trans>
  if (name === 'Podcasts') name = <Trans>Podcasts</Trans>
  if (name === 'Tasks') name = <Trans>Tasks</Trans>
  if (name === 'Images') name = <Trans>Images</Trans>
  if (name === 'Bookmarks') name = <Trans>Bookmarks</Trans>
  if (name === 'Friends') name = <Trans>Friends</Trans>
  if (name === 'Projects') name = <Trans>Projects</Trans>
  if (name === 'Pages') name = <Trans>Pages</Trans>
  //
  if (name === 'Article') name = <Trans>Article</Trans>
  if (name === 'Note') name = <Trans>Note</Trans>
  if (name === 'Podcast') name = <Trans>Podcast</Trans>
  if (name === 'Task') name = <Trans>Task</Trans>
  if (name === 'Image') name = <Trans>Image</Trans>
  if (name === 'Bookmark') name = <Trans>Bookmark</Trans>
  if (name === 'Friend') name = <Trans>Friend</Trans>
  if (name === 'Project') name = <Trans>Project</Trans>
  if (name === 'Page') name = <Trans>Page</Trans>
  return name
}
