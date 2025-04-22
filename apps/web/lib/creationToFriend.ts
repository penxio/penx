import { ICreation } from '@penx/model/ICreation'
import { IMold } from '@penx/model/IMold'
import { Creation, Friend, Prop } from './theme.types'
import { SiteCreation } from './types'

export function creationToFriend(
  creation: ICreation | Creation | SiteCreation,
  mold: IMold,
): Friend {
  const props = (mold?.props || []) as Prop[]
  const output = props.reduce(
    (acc, prop) => {
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
