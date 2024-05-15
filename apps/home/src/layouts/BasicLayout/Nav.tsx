import { ReactNode } from 'react'
import { Box } from '@fower/react'
import { APP_DOWNLOAD_URL } from '~/common/constants'
import { StyledLink } from '~/components/StyledLink'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
}

export const Nav = () => {
  const navData: NavItem[] = [
    // {
    //   text: 'Bounty tasks',
    //   to: 'https://github.com/penxio/penx/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%92%8E+Bounty%22',
    //   isExternal: true,
    // },
    // {
    //   text: 'Believer NFTs',
    //   to: '/believer-nft',
    // },

    // {
    //   text: 'Whitepaper',
    //   to: 'https://whitepaper.penx.io',
    //   isExternal: true,
    // },

    // {
    //   text: 'Roadmap',
    //   to: '/roadmap',
    // },

    {
      text: 'Developer',
      to: 'https://docs.penx.io//build-extension/create-first-extension',
      isExternal: true,
    },

    {
      text: 'Downloads',
      to: APP_DOWNLOAD_URL,
      // isExternal: true,
    },
    {
      text: 'Feedback',
      to: 'https://github.com/penxio/penx/issues',
      isExternal: true,
    },
    {
      text: 'Blog',
      to: 'https://blog.penx.io/blog/why-build-penx',
      isExternal: true,
    },
  ]

  return (
    <Box listNone toCenterY gap6 textBase display={['none', 'none', 'flex']}>
      {navData.map((item, i) => {
        if (item.isExternal) {
          return (
            <Box key={i}>
              <Box
                as="a"
                href={item.to}
                target="_blank"
                cursorPointer
                gray600
                toCenterY
                gap1
                brand500--hover
                noUnderline
                transitionCommon
              >
                {item.text && <Box>{item.text}</Box>}
                {!!item.icon && item.icon}
                {/* <Box inlineFlex>
                  <ExternalLink size={16}></ExternalLink>
                </Box> */}
              </Box>
            </Box>
          )
        }

        return (
          <Box key={i}>
            <StyledLink
              href={item.to}
              gray600
              brand500--hover
              transitionCommon
              noUnderline
            >
              {item.text}
            </StyledLink>
          </Box>
        )
      })}
    </Box>
  )
}
