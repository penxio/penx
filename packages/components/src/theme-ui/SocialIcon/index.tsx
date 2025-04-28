import { cn } from '@penx/utils'
import {
  Discord,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Mastodon,
  Threads,
  Twitter,
  X,
  Youtube,
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  discord: Discord,
  threads: Threads,
  instagram: Instagram,
}

type SocialIconProps = {
  kind:
    | keyof typeof components
    | 'farcaster'
    | 'bilibili'
    | 'telegram'
    | 'slack'
    | 'medium'
  href: string | undefined
  size?: number
}

export const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null

  // @ts-ignore
  let SocialSvg = components[kind]

  let iconJsx: any = null

  if (!!SocialIcon) {
    iconJsx = (
      <SocialSvg
        className={`text-foreground/70 hover:text-brand dark:hover:text-brand/80 fill-current size-${size}`}
      />
    )
  }

  if (kind === 'bilibili') {
    iconJsx = (
      <div className="inline-flex h-full">
        <span
          className={cn(`icon-[mingcute--bilibili-line] size-${size}`)}
        ></span>
      </div>
    )
  }

  if (kind === 'telegram') {
    iconJsx = (
      <div className="inline-flex h-full">
        <span className={`icon-[lineicons--telegram] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'slack') {
    iconJsx = (
      <div className="inline-flex h-full">
        <span className={`icon-[mdi--slack] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'farcaster') {
    iconJsx = (
      <div className="inline-flex h-full">
        <span className={`icon-[simple-icons--farcaster] size-${size}`}></span>
      </div>
    )
  }

  if (kind === 'medium') {
    iconJsx = (
      <div className="inline-flex h-full">
        <span className={`icon-[ri--medium-fill] size-${size}`}></span>
      </div>
    )
  }

  return (
    <a
      className="text-foreground/60 hover:text-foreground/70 text-sm leading-none transition"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      {iconJsx}
    </a>
  )
}

export default SocialIcon

export * from './icons'
