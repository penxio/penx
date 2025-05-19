import { IStructNode } from '@penx/model-type'
import { SiteCreation } from '@penx/types'
import { Creation, Friend } from './theme.types'

export function creationToFriend(
  creation: Creation | SiteCreation,
  struct: IStructNode,
): Friend {
  const props: any = []
  const output = props.reduce(
    (acc: any, prop: any) => {
      return { ...acc, [prop.slug]: creation.props?.[prop.id] }
    },
    {} as Record<string, any>,
  )

  return {
    id: creation.id,
    name: creation.title,
    introduction: creation.description,
    ...output,
  } as Friend
}
