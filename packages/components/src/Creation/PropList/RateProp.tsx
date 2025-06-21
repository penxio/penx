import { cn } from '@penx/utils'
import { StarSVG } from '../../StarSVG'

interface Props {
  value: string
  onChange: (v: string) => void
}
export const RateProp = ({ value = '0', onChange }: Props) => {
  return (
    <div className="flex h-10 items-center px-3">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            'relative mr-[2px] h-4 w-4 cursor-pointer',
            Number(value) < index + 1
              ? 'text-foreground/40'
              : 'text-yellow-500',
          )}
          onClick={() => {
            onChange((index + 1).toString())
          }}
        >
          <StarSVG />
        </div>
      ))}
    </div>
  )
}
