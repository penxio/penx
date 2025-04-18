import { PropsWithChildren, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { addressMap } from '@/lib/address'
import { Link } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TokenInfoItemProps {
  label: string
  value: ReactNode
}

// export const runtime = 'edge'

function TokenInfoItem({ label, value }: TokenInfoItemProps) {
  return (
    <div className="space-y-2">
      <div className="text-foreground/60 text-xl">{label}</div>
      <div className="text-foreground text-3xl font-bold">{value}</div>
    </div>
  )
}

interface AllocationItemProps {
  percent: string
  desc: string
  dotColor: string
}

function AllocationItem({ percent, desc, dotColor }: AllocationItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-3 w-3 rounded-full', dotColor)} />
      <div className="text-foreground w-14 text-2xl font-bold">{percent}</div>
      <div className="text-foreground/60 text-lg">{desc}</div>
    </div>
  )
}

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="mt-20 space-y-20 pb-20">
      <div className="bg-background flex flex-col justify-center gap-4 rounded-2xl p-8 shadow">
        <div className="text-5xl font-bold">$PEN</div>
        <div className="text-foreground/60 space-y-1 text-4xl font-thin">
          <div className="">
            Tip token for{' '}
            <span className="text-brand font-bold">individual Blog</span>
          </div>
          <div>
            Tip token for{' '}
            <span className="font-bold text-orange-500">Writers</span>
          </div>
          <div className="">
            Tip token for{' '}
            <span className="font-bold text-sky-500">PenX community</span>
          </div>
        </div>
        <div className="text-foreground/80 text-xl leading-relaxed">
          $PEN is the token of PenX community, a Web3 blogging platform that
          champions content ownership and free expression. Designed to reward
          quality creators, $PEN enables tipping, subscription models, and
          governance participation. By holding $PEN, users can engage in
          community decisions and earn rewards, fostering a vibrant ecosystem
          where ideas flourish and creativity thrives. Join us in planting the
          seeds for a decentralized blog future!
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex-1 space-y-6">
            <TokenInfoItem label="Token name" value="Pen" />
            <TokenInfoItem label="Symbol" value="$PEN" />
            <TokenInfoItem label="Chain" value="Base" />
            <TokenInfoItem label="Supply" value="30,000,000,000" />
            <TokenInfoItem
              label="Contract"
              value={
                <div className="text-sm sm:text-base">
                  {addressMap.PenToken}
                </div>
              }
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-foreground/70 text-2xl font-bold">
              Allocation
            </div>
            <div className="space-y-4">
              <AllocationItem
                percent="66%"
                desc="PenX community"
                dotColor="bg-green-500"
              />
              <AllocationItem
                percent="4%"
                desc="Liquidity Providers"
                dotColor="bg-orange-500"
              />
              <AllocationItem
                percent="10%"
                desc="Early sponsors"
                dotColor="bg-red-500"
              />
              <AllocationItem
                percent="8%"
                desc="Early backers"
                dotColor="bg-red-500"
              />
              <AllocationItem
                percent="12%"
                desc="Core contributors"
                dotColor="bg-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex flex-col justify-center gap-12 rounded-2xl p-8 shadow">
        <div className="pt text-5xl font-extrabold">How get $PEN?</div>
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xl font-medium">
                1. Sponsor PenX project and get $PEN:{' '}
              </div>
              <Button size="sm" asChild variant="brand">
                <Link href="/sponsor">Go to sponsor</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xl font-medium">
                2. Create a blog and get $PEN automatically.
              </div>
            </div>

            <div className="text-foreground flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="text-xl font-medium ">
                  3. Contribute to the PenX project and earn rewards.
                </div>
                <Button size="sm" asChild variant="brand">
                  <Link href="/sponsor">Request rewards</Link>
                </Button>
              </div>
              <ul className="text-foreground/80 ml-5 list-inside list-disc">
                <li>
                  Contribute code to{' '}
                  <a
                    href="https://github.com/penx-lab/penx"
                    className="text-brand"
                  >
                    github.com/penx-lab/penx
                  </a>
                  .
                </li>
                <li>
                  Contribute valid issues to{' '}
                  <a
                    href="https://github.com/penx-lab/penx"
                    target="_blank"
                    className="text-brand"
                  >
                    github.com/penx-lab/penx
                  </a>
                  .
                </li>
                <li>
                  Improve docs{' '}
                  <a
                    href="https://github.com/penx-lab/penx-docs"
                    target="_blank"
                    className="text-brand"
                  >
                    https:/github.com/penx-lab/penx-docs
                  </a>
                  .
                </li>
                <li>
                  Improve official themes{' '}
                  <a
                    href="https://github.com/penx-lab/penx-themes"
                    target="_blank"
                    className="text-brand"
                  >
                    github.com/penx-lab/penx-themes
                  </a>
                  .
                </li>
                <li>Create new theme.</li>
                <li>Any contributions to the PenX project...</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="text-xl font-medium">
                  4. Curate the PenX project and earn rewards.
                </div>
                <Button size="sm" asChild variant="brand">
                  <Link href="/sponsor">Request rewards</Link>
                </Button>
              </div>
              <ul className="ml-5 list-inside list-disc">
                <li>Write some post about PenX</li>
                <li>Post a tweet about PenX on X</li>
                <li>Make a cast about PenX on Farcaster</li>
                <li>Any curation to the PenX project...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
