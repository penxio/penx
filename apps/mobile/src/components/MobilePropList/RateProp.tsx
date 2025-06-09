import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { StarSVG } from '@penx/components/StarSVG'
import { cn } from '@penx/utils'

interface Props {
  value: string[]
  onChange: (v: string) => void
}
export const RateProp = ({ value, onChange }: Props) => {
  return (
    <div className="flex h-full items-center justify-end px-3">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            'relative ml-[2px] size-6 cursor-pointer',
            Number(value) < index + 1
              ? 'text-foreground/40'
              : 'text-yellow-500',
          )}
          onClick={async () => {
            onChange((index + 1).toString())
            await Haptics.impact({ style: ImpactStyle.Medium })
          }}
        >
          <StarSVG />
        </div>
      ))}
    </div>
  )
}
