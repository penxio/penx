import { cn } from '@penx/utils'

interface Props {
  className?: string
}

export function SocialNav({ className }: Props) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2',
        className,
      )}
    >
      <a
        href="https://discord.com/invite/nyVpH9njDu"
        target="_blank"
        className="inline-flex"
      >
        <span className="icon-[ic--round-discord] hover:text-foreground/60 text-foreground/80  h-7 w-7"></span>
      </a>
      <a
        href="https://github.com/penx-labs/penx"
        target="_blank"
        className="inline-flex"
      >
        <span className="icon-[mdi--github] hover:text-foreground/60 text-foreground/80  h-7 w-7"></span>
      </a>
      <a href="https://x.com/zio_penx" target="_blank" className="inline-flex">
        <span className="icon-[prime--twitter] hover:text-foreground/60 text-foreground/80 h-5 w-5"></span>
      </a>
    </div>
  )
}
