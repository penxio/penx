'use client'

import { PropsWithChildren } from 'react'
import { useSession } from '@penx/session'
import { useSiteContext } from '@/components/SiteContext'
import { Separator } from '@penx/uikit/ui/separator'
import { Link, usePathname } from '@/lib/i18n'
import { isSuperAdmin } from '@/lib/isSuperAdmin'
import { Features } from '@penx/types'
import { cn } from '@penx/utils'
import { Trans } from '@lingui/react/macro'

interface Props {}

export function SettingNav({}: Props) {
  const pathname = usePathname()
  const { data } = useSession()
  const site = useSiteContext()

  const Paths = {
    profile: '/~/settings/profile',
    payoutAccount: '/~/settings/payout-account',
    general: '/~/settings',
    linkAccounts: '/~/settings/link-accounts',
    appearance: '/~/settings/appearance',
    i18n: '/~/settings/i18n',
    navigation: '/~/settings/navigation',
    catalogue: '/~/settings/catalogue',
    features: '/~/settings/features',
    socials: '/~/settings/socials',
    domain: '/~/settings/domain',
    tags: '/~/settings/tags',
    creationTypes: '/~/settings/creation-types',
    web3: '/~/settings/web3',
    subscription: '/~/settings/subscription',
    collaborators: '/~/settings/collaborators',
    accessToken: '/~/settings/access-token',
    analytics: '/~/settings/analytics',
    importExport: '/~/settings/import-export',
    projects: '/~/settings/projects',
    friends: '/~/settings/friends',
    backup: '/~/settings/backup',
    membership: '/~/settings/membership',
    products: '/~/settings/products',
    orders: '/~/settings/orders',
    seo: '/~/settings/seo',
    campaign: '/~/settings/campaign',
    dangerous: '/~/settings/dangerous',
    members: '/~/settings/members',
    archived: '/~/settings/archived',
    coupons: '/~/settings/coupons',
    discover: '/~/settings/discover',
    comments: '/~/settings/comments',
    subscribers: '/~/settings/subscribers',
    partnerProgram: '/~/settings/partner-program',
  }

  const linkClassName = (path: string) =>
    cn(
      'item-center text-foreground/60 hover:text-foreground hover:border-foreground/40 -mb-[1px] inline-flex shrink-0 justify-center border-b-2 border-transparent py-1.5 md:justify-start md:border-none',
      path === pathname && 'border-foreground/60',
      path === pathname && 'text-foreground font-bold',
    )

  return (
    <div
      className="space-y-6 overflow-auto px-4 pb-10 pt-8"
      style={{
        height: 'calc(100vh - 48px)',
      }}
    >
      <Section title="Account">
        <Link href={Paths.profile} className={linkClassName(Paths.profile)}>
          <Trans>Profile</Trans>
        </Link>
        <Link
          href={Paths.payoutAccount}
          className={linkClassName(Paths.payoutAccount)}
        >
          <Trans>Payout account</Trans>
        </Link>
        <Link
          href={Paths.linkAccounts}
          className={linkClassName(Paths.linkAccounts)}
        >
          <Trans>Link accounts</Trans>
        </Link>
      </Section>

      <Separator className="w-3/4" />

      <Section title="Site - general">
        <Link href={Paths.general} className={linkClassName(Paths.general)}>
          <Trans>General</Trans>
        </Link>
        {/* <Link href={Paths.features} className={linkClassName(Paths.features)}>
          <Trans>Features</Trans>
        </Link> */}

        {/* <Link href={Paths.web3} className={linkClassName(Paths.web3)}>
          Web3
        </Link> */}

        <Link
          href={Paths.subscription}
          className={linkClassName(Paths.subscription)}
        >
          <Trans>Billing & plan</Trans>
        </Link>

        <Link href={Paths.tags} className={linkClassName(Paths.tags)}>
          <Trans>Tags</Trans>
        </Link>

        <Link
          href={Paths.creationTypes}
          className={linkClassName(Paths.creationTypes)}
        >
          <Trans>Creation types</Trans>
        </Link>

        {/* <Link href={Paths.i18n} className={linkClassName(Paths.i18n)}>
          <Trans>i18n</Trans>
        </Link> */}
      </Section>

      <Section title="Site - creator economy">
        <Link
          href={Paths.membership}
          className={linkClassName(Paths.membership)}
        >
          <Trans>Membership</Trans>
        </Link>
        <Link href={Paths.members} className={linkClassName(Paths.members)}>
          <Trans>Paid members</Trans>
        </Link>
        <Link href={Paths.products} className={linkClassName(Paths.products)}>
          <Trans>Products</Trans>
        </Link>
        <Link href={Paths.orders} className={linkClassName(Paths.orders)}>
          <Trans>Orders</Trans>
        </Link>
        {/* <Link href={Paths.campaign} className={linkClassName(Paths.campaign)}>
          <Trans>Campaign</Trans>
        </Link> */}
      </Section>

      <Section title="Site - UI">
        <Link
          href={Paths.appearance}
          className={linkClassName(Paths.appearance)}
        >
          <Trans>Appearance</Trans>
        </Link>
        <Link
          href={Paths.navigation}
          className={linkClassName(Paths.navigation)}
        >
          <Trans>Navigation</Trans>
        </Link>
        <Link href={Paths.socials} className={linkClassName(Paths.socials)}>
          <Trans>Socials</Trans>
        </Link>

        {/* <Link href={Paths.catalogue} className={linkClassName(Paths.catalogue)}>
          <Trans>Catalogue</Trans>
        </Link> */}
      </Section>

      <Section title="Site - data">
        <Link href={Paths.comments} className={linkClassName(Paths.comments)}>
          <Trans>Comments</Trans>
        </Link>
        <Link
          href={Paths.subscribers}
          className={linkClassName(Paths.subscribers)}
        >
          <Trans>Subscribers</Trans>
        </Link>
      </Section>

      <Section title="Site - advanced">
        <Link
          href={Paths.collaborators}
          className={linkClassName(Paths.collaborators)}
        >
          <Trans>Collaborators</Trans>
        </Link>
        <Link
          href={Paths.partnerProgram}
          className={linkClassName(Paths.partnerProgram)}
        >
          <Trans>Partner program</Trans>
        </Link>
        <Link
          href={Paths.accessToken}
          className={linkClassName(Paths.accessToken)}
        >
          <Trans>Access token</Trans>
        </Link>

        <Link href={Paths.seo} className={linkClassName(Paths.seo)}>
          <Trans>SEO</Trans>
        </Link>

        <Link href={Paths.analytics} className={linkClassName(Paths.analytics)}>
          <Trans>Analytics</Trans>
        </Link>

        <Link href={Paths.domain} className={linkClassName(Paths.domain)}>
          <Trans>Domain</Trans>
        </Link>

        <Link href={Paths.backup} className={linkClassName(Paths.backup)}>
          <Trans>Backup</Trans>
        </Link>

        <Link
          href={Paths.importExport}
          className={linkClassName(Paths.importExport)}
        >
          <Trans>Import/Export</Trans>
        </Link>
        <Link href={Paths.archived} className={linkClassName(Paths.archived)}>
          <Trans>Archived</Trans>
        </Link>

        {isSuperAdmin(data?.userId) && (
          <>
            <Link
              href={Paths.discover}
              className={linkClassName(Paths.discover)}
            >
              <Trans>Discover</Trans>
            </Link>

            <Link href={Paths.coupons} className={linkClassName(Paths.coupons)}>
              <Trans>Coupons</Trans>
            </Link>
          </>
        )}

        {/* <Link href={Paths.dangerous} className={linkClassName(Paths.dangerous)}>
          <Trans>Dangerous</Trans>
        </Link> */}
      </Section>
    </div>
  )
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="-mx-3 flex flex-row items-center gap-x-8 overflow-x-auto overflow-y-hidden border-b px-3 md:w-[240px] md:flex-col md:items-start md:border-none">
      <div className="text-foreground/30 text-xs">{title}</div>
      {children}
    </div>
  )
}
