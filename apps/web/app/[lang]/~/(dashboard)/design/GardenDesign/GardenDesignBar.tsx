'use client'

import { ReactNode } from 'react'
import { GardenCardType, ROOT_HOST, SocialType } from '@/lib/constants'
import { CreationType } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { produce } from 'immer'
import {
  BookOpenTextIcon,
  FileTextIcon,
  HandshakeIcon,
  ImageIcon,
  KanbanIcon,
  MessageCircleMoreIcon,
  NotebookTextIcon,
  PodcastIcon,
  TextIcon,
} from 'lucide-react'
import { BarToggle } from './BarToggle'
import { DesignSettings } from './DesignSettings'
import { BarType, useDesignContext } from './hooks/DesignContext'
import { useAddCard } from './hooks/useAddCard'

const socials = [
  SocialType.TWITTER,
  SocialType.INSTAGRAM,
  SocialType.DISCORD,
  SocialType.FACEBOOK,
  SocialType.GITHUB,
  SocialType.YOUTUBE,
  SocialType.LINKEDIN,
  SocialType.TELEGRAM,
  SocialType.TIKTOK,
  SocialType.THREADS,
  SocialType.MASTODON,
  SocialType.SNAPCHAT,
  SocialType.EMAIL,
  SocialType.BEHANCE,
  SocialType.DRIBBBLE,
  SocialType.MEDIUM,
  SocialType.SUBSTACK,
  SocialType.BUYMEACOFFEE,
  SocialType.PATREON,
  SocialType.KOFI,
]

interface Props {
  onAddLayoutItem: (type: string) => void
}

export function GardenDesignBar() {
  const addCard = useAddCard()
  const { barType } = useDesignContext()

  let props: Props = {
    onAddLayoutItem: addCard,
  }

  return (
    <div className="ring-foreground/5 bg-foreground/5 fixed left-8 top-[15vh] z-50 flex h-[70vh] w-48 flex-col items-center gap-6 rounded-xl px-2 py-2 shadow-md ring-1">
      <div>
        <BarToggle />
      </div>
      {barType === BarType.SETTINGS && <DesignSettings />}
      {barType === BarType.COMPONENT && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Item name="Title" type={GardenCardType.TITLE} {...props}>
              <span className="text-sm font-bold">
                <Trans>Title</Trans>
              </span>
            </Item>
            <Item
              name={<Trans>Text</Trans>}
              type={GardenCardType.TEXT}
              {...props}
            >
              <TextIcon />
            </Item>
            <Item
              name={<Trans>Image</Trans>}
              type={CreationType.IMAGE}
              {...props}
            >
              <ImageIcon />
            </Item>
            <Item
              name={<Trans>Articles</Trans>}
              type={CreationType.ARTICLE}
              {...props}
              className=""
            >
              <FileTextIcon />
            </Item>
            <Item
              name={<Trans>Podcasts</Trans>}
              type={CreationType.AUDIO}
              {...props}
            >
              <PodcastIcon />
            </Item>
            <Item
              name={<Trans>Areas</Trans>}
              type={GardenCardType.AREA}
              {...props}
            >
              <BookOpenTextIcon />
            </Item>
            <Item
              name={<Trans>Friends</Trans>}
              type={GardenCardType.FRIENDS}
              {...props}
            >
              <HandshakeIcon />
            </Item>
            <Item
              name={<Trans>Projects</Trans>}
              type={CreationType.PROJECT}
              {...props}
            >
              <KanbanIcon />
            </Item>
            <Item
              name={<Trans>Comments</Trans>}
              type={GardenCardType.COMMENTS}
              {...props}
            >
              <MessageCircleMoreIcon />
            </Item>
            <Item
              name={<Trans>Guestbook</Trans>}
              type={GardenCardType.GUESTBOOK}
              {...props}
            >
              <NotebookTextIcon />
            </Item>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {socials.map((social) => (
              <div
                key={social}
                className="size-8 cursor-pointer overflow-hidden rounded-md shadow"
                onClick={() => props?.onAddLayoutItem?.(social)}
              >
                <img
                  src={`${ROOT_HOST}/images/socials/${social.toLowerCase()}.webp`}
                  className="size-full"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function Item({
  name,
  type,
  onAddLayoutItem,
  children,
  className,
}: Props & {
  name: ReactNode
  type: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div className="inline-flex w-12 flex-col gap-1">
      <div
        className={cn(
          'bg-background flex size-12 cursor-pointer items-center justify-center rounded-md shadow transition-all hover:ring-1',
          className,
        )}
        onClick={() => onAddLayoutItem?.(type)}
      >
        {children}
      </div>
      <div className="text-foreground/60 text-center text-[10px]">{name}</div>
    </div>
  )
}
