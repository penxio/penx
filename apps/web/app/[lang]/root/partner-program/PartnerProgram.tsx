import { ReferralLink } from './ReferralLink'

export function PartnerProgram() {
  return (
    <div className="mx-auto -mt-20 space-y-4 text-center">
      <div className="space-y-2 text-center text-5xl font-semibold leading-tight md:text-6xl">
        <div className="font-serif">
          Welcome to The <br /> PenX Partner Program
        </div>
      </div>

      <div className="text-3xl">Get 50% of referred payments forever</div>
      <div className="text-foreground/80 mx-auto w-full text-center text-lg md:max-w-[640px]">
        PenX's Partner Program is designed for individuals interested in helping
        us expand our reach, promote our products or services, and grow our
        community. By joining the program, you can earn a continuous 50%
        commission on referred payments and be part of our shared growth
        journey.
      </div>

      <div className="mt-6 flex h-[126px] flex-col gap-5">
        <ReferralLink />
      </div>
    </div>
  )
}
