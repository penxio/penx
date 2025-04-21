import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { cn, getUrl } from '@penx/utils'

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function initFromColor(i: number) {
  const colors = [
    'from-red-500',
    'from-yellow-500',
    'from-green-500',
    'from-blue-500',
    'from-indigo-500',
    'from-purple-500',
    'from-pink-500',
    'from-red-600',
    'from-yellow-600',
    'from-green-600',
    'from-blue-600',
    'from-indigo-600',
    'from-purple-600',
    'from-pink-600',
  ]
  return colors[Math.abs(i) % colors.length]
}

function initToColor(i: number) {
  const colors = [
    'to-red-500',
    'to-yellow-500',
    'to-green-500',
    'to-blue-500',
    'to-indigo-500',
    'to-purple-500',
    'to-pink-500',
    'to-red-600',
    'to-yellow-600',
    'to-green-600',
    'to-blue-600',
    'to-indigo-600',
    'to-purple-600',
    'to-pink-600',
  ]
  return colors[Math.abs(i) % colors.length]
}

function generateGradient(walletAddress: string) {
  if (!walletAddress) return `bg-gradient-to-r to-pink-500 to-purple-500`
  const hash = hashCode(walletAddress)
  const from = initFromColor(hash)
  const to = initToColor(hash >> 8)
  return `bg-gradient-to-r ${from} ${to}`
}

interface UserAvatarProps {
  className?: string
  address?: string
  image?: string
}

export function UserAvatar({
  address = '',
  image,
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {image && <AvatarImage src={getUrl(image)} alt="" />}
      <AvatarFallback
        className={cn('text-xs text-white', generateGradient(address))}
      ></AvatarFallback>
    </Avatar>
  )
}
