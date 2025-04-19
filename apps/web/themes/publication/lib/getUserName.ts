import { User } from '@penx/types'

export function getUserName(user: User) {
  if (!user) return ''
  const { displayName = '', name } = user

  return user.displayName || user.name
}
