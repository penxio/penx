import { Link } from '@penx/libs/i18n'
import { cn } from '@penx/utils'
import {
  ArrowUpRight,
  BotIcon,
  BugIcon,
  MailIcon,
  MessageCircleMore,
  PaletteIcon,
  PencilIcon,
  RocketIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react'

const themes: string[] = [
  'minimal',
  'micro',
  'aside',
  'publication',
  'square',
  'sue',
  'paper',
  'wide',
  'garden',
  'maple',
  'card',
  'docs',
]

export function ThemeList() {
  return (
    <div className="mt-10 space-y-10">
      <div className="space-y-4 text-center">
        <div className="text-6xl font-bold">Themes</div>
        <div className="text-foreground/60 text-xl">
          Some beautiful themes for PenX.
        </div>
      </div>
      <div className="bg-transparent">
        <div className="border-foreground/10 grid grid-cols-1 justify-center overflow-hidden border-l border-t sm:grid-cols-2 xl:grid-cols-3">
          {themes.map((theme, index) => {
            let host = `theme-${theme}.penx.io`
            if (theme === 'docs') host = 'docs.penx.io'
            const link = `https://${host}`
            return (
              <div
                key={index}
                className={cn(
                  'border-foreground/10 bg-background/30 group space-y-3 border-b border-r p-8 transition-all',
                )}
              >
                <div className="text-5xl font-bold">{theme.toUpperCase()}</div>
                <a
                  href={link}
                  target="_blank"
                  className="text-foreground/50 hover:text-foreground/90 flex gap-0.5 text-base transition-all group-hover:scale-105"
                >
                  <span>{host}</span>
                  <ArrowUpRight size={16} className="text-foreground/60" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
