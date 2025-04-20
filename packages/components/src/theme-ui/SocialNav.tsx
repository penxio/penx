import { Site } from '@penx/types'
import { cn } from '@penx/utils'
import SocialIcon from './SocialIcon'

interface Props {
  site: Site
  className?: string
  size?: number
}

export function SocialNav({ site, className, size = 5 }: Props) {
  if (!site) return null
  const socials = site.socials
  return (
    <div className={cn('item-center text-foreground/70 flex gap-4', className)}>
      <SocialIcon kind="x" href={socials.x} size={size} />
      <SocialIcon kind="twitter" href={socials.twitter} size={size} />
      <SocialIcon kind="facebook" href={socials.facebook} size={size} />
      <SocialIcon kind="youtube" href={socials.youtube} size={size} />
      <SocialIcon kind="linkedin" href={socials.linkedin} size={size} />
      <SocialIcon kind="discord" href={socials.discord} size={size} />
      <SocialIcon kind="instagram" href={socials.instagram} size={size} />
      <SocialIcon kind="mastodon" href={socials.mastodon} size={size} />
      <SocialIcon kind="medium" href={socials.medium} size={size} />
      <SocialIcon kind="threads" href={socials.threads} size={size} />
      <SocialIcon kind="slack" href={socials.slack} size={size} />
      <SocialIcon kind="telegram" href={socials.telegram} size={size} />
      <SocialIcon kind="farcaster" href={socials.farcaster} size={size} />
      <SocialIcon kind="github" href={socials.github} size={size} />
      <SocialIcon kind="bilibili" href={socials.bilibili} size={size} />
      <SocialIcon kind="mail" href={`mailto:${socials?.email}`} size={size} />
    </div>
  )
}
