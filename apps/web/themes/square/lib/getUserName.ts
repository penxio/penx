import { User } from '@/lib/theme.types'
import { isAddress } from '@/lib/utils'

export function getUserName(user: User) {
  if (!user) return ''
  const { displayName = '', name } = user

  if (displayName) {
    if (isAddress(displayName)) {
      return displayName.slice(0, 3) + '...' + displayName.slice(-4)
    }
    return user.displayName || user.name
  }

  if (isAddress(name)) {
    return name.slice(0, 3) + '...' + name.slice(-4)
  }
  return user.displayName || user.name
}
