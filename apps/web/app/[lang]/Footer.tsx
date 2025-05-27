import { LangSwitcher } from '@penx/components/LangSwitcher'
import { ModeToggle } from '@penx/components/ModeToggle'
import { SocialNav } from '@penx/components/SocialNav'
import { Link } from '@penx/libs/i18n'

// import { Trans } from '@lingui/react/macro'

interface Props {}

export function Footer({}: Props) {
  return (
    <footer className="mb-4 mt-auto">
      <div className="flex flex-col items-center">
        <div className="item-center mb-2 flex space-x-4">
          <SocialNav className="text-foreground/80" />
        </div>

        <div className="item-center text-foreground/50 flex justify-center gap-4 text-sm">
          {/* <div className="flex items-center">
            <a
              href="https://penx.io/about"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>
                <Trans>About</Trans>
              </span>
            </a>
          </div> */}

          {/* <div className="flex items-center">
            <a
              href="https://penx.io/docs/introduction"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>
                <Trans>Docs</Trans>
              </span>
            </a>
          </div> */}

          {/* <div className="flex items-center">
            <a
              href="https://0xz.io"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>
                <Trans>Blog</Trans>
              </span>
            </a>
          </div> */}
          {/* <div className="flex items-center">
            <a
              href="https://github.com/penx-labs/penx-desktop/releases"
              target="_blank"
              className="flex items-center gap-1"
            >
              <span>Download</span>
            </a>
          </div> */}
          {/* <div className="flex items-center">
            <Link href="/privacy" className="">
              Privacy
            </Link>
          </div> */}

          {/* <div className="flex items-center">
            <Link href="/refund-policy" className="">
              Refund policy
            </Link>
          </div> */}

          {/* <div className="flex items-center">
            <Link href="/terms" className="">
              Terms & Conditions
            </Link>
          </div> */}
        </div>
        <div className="item-center text-foreground/50 flex justify-center gap-2 text-sm">
          <div className="flex items-center">{`© ${new Date().getFullYear()}`}</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">PenX</div>
          <div className="flex items-center">{` • `}</div>
          <div className="flex items-center">All rights reserved</div>
          <div className="flex items-center">{` • `}</div>
          <ModeToggle />
          <LangSwitcher />
        </div>
      </div>
    </footer>
  )
}
