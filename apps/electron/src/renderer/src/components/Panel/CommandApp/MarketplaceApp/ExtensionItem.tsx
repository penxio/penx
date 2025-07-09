import { useMemo } from 'react'
import { Box } from '@fower/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DownloadCloud } from 'lucide-react'
import { RouterOutputs } from '@penx/api'
import { db } from '@penx/local-db'
import { Manifest } from '@penx/model'
import { IExtension } from '@penx/model-types'
import { fetchInstallationJSON } from '~/common/fetchInstallationJSON'
import { StyledCommandItem } from '../../CommandComponents'
import { ListItemIcon } from '../../ListItemIcon'

type ExtensionItem = RouterOutputs['extension']['all'][0]

interface ExtensionItemProps {
  item: ExtensionItem
  extensions: IExtension[]
  onSelect: (item: ExtensionItem) => void
}

export function ExtensionItem({
  item,
  extensions,
  onSelect,
}: ExtensionItemProps) {
  const manifest = new Manifest(item.manifest as any)
  const installed = !!extensions.find((e) => e.name === manifest.name)

  const icon = useMemo(() => {
    try {
      const icon = JSON.parse(item.logo)
      return typeof icon === 'object' ? icon : item.logo
    } catch (error) {
      return item.logo
    }
  }, [item.logo])

  const { refetch } = useQuery({
    queryKey: ['extension', 'installed'],
    queryFn: () => db.listExtensions(),
  })

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['extension', item.id],
    mutationFn: async () => {
      const json = await fetchInstallationJSON(manifest.name)
      if (json) {
        const { id: slug, ...data } = json
        await db.upsertExtension(slug, data as any)
      }
    },
  })

  function onSelectExtension(item: ExtensionItem) {
    onSelect(item)
  }

  return (
    <StyledCommandItem
      key={item.id}
      cursorPointer
      toCenterY
      toBetween
      px2
      py3
      gap2
      roundedLG
      black
      value={item.id}
      onSelect={() => onSelectExtension(item)}
      onClick={() => onSelectExtension(item)}
    >
      <Box toCenterY gap2>
        <ListItemIcon icon={icon} />
        <Box column>
          <Box textSM>{manifest.name}</Box>
          <Box text-13 gray400>
            {manifest.description}
          </Box>
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
      </Box>
    </StyledCommandItem>
  )
}
