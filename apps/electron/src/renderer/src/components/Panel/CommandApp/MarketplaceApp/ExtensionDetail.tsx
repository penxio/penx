import { useMemo } from 'react'
import { Box } from '@fower/react'
import { open } from '@tauri-apps/plugin-shell'
import { DownloadCloud } from 'lucide-react'
import { Divider } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { IconGitHub } from '@penx/icons'
import { Manifest } from '@penx/model'
import { IExtension } from '@penx/model-types'
import { Markdown } from '~/components/Markdown'
import { ListItemIcon } from '../../ListItemIcon'
import { InstallExtensionButton } from './InstallExtensionButton'
import { UninstallExtensionButton } from './UninstallExtensionButton'

type ExtensionItem = RouterOutputs['extension']['all'][0]

interface ExtensionDetailProps {
  item: ExtensionItem
  extensions: IExtension[]
}

export function ExtensionDetail({ item, extensions }: ExtensionDetailProps) {
  const manifest = new Manifest(item.manifest as any)
  const installed = extensions.find((e) => e.name === manifest.name)

  const icon = useMemo(() => {
    try {
      const icon = JSON.parse(item.logo)
      return typeof icon === 'object' ? icon : item.logo
    } catch (error) {
      return item.logo
    }
  }, [item.logo])

  return (
    <Box p4>
      <Box>
        <Box gap2 column>
          <Box toCenterY toBetween>
            <Box toCenterY gap2 mb3>
              <ListItemIcon icon={icon} size={36} />
              <Box text2XL fontBlack>
                {manifest.title}
              </Box>
            </Box>
            <Box>
              {!!installed && (
                <UninstallExtensionButton localExtensionId={installed.id} />
              )}

              {!installed && <InstallExtensionButton item={item} />}

              {/* <Button
                variant="outline"
                colorScheme="black"
                size="sm"
                onClick={() => {
                  //
                }}
              >
                Copy share link
              </Button> */}
            </Box>
          </Box>

          <Box toCenterY gap4>
            <Box>
              <Box toCenterY gap1>
                <Box gray600>
                  <DownloadCloud size={16} />
                </Box>
                <Box textBase>{item.installationCount}</Box>
              </Box>
            </Box>
            {manifest.author && (
              <Box textSM gap1 toCenterY>
                <Box gray600>By</Box>
                <Box>{manifest.author}</Box>
              </Box>
            )}

            {manifest.repo && (
              <Box toCenterY gap1 cursorPointer>
                <IconGitHub size={16} gray600 />
                <Box
                  as="a"
                  textBase
                  gray800
                  inlineFlex
                  onClick={() => open(manifest.repoURL)}
                >
                  {manifest.repo}
                </Box>
              </Box>
            )}
          </Box>

          <Box textBase>{manifest.description}</Box>
        </Box>
      </Box>

      {manifest.screenshots?.length > 0 && (
        <Box grid gridTemplateColumns-3 mt4 gap3>
          {manifest.screenshots?.map((item) => (
            <Box
              key={item}
              as="img"
              src={`https://raw.githubusercontent.com/penxio/marketplace/main/extensions/hack-news/screenshots/${item}`}
              w-100p
            />
          ))}
        </Box>
      )}

      <Divider my4 />
      {item.readme && <Markdown content={item.readme} />}
    </Box>
  )
}
