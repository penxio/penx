import { Box } from '@fower/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Spinner } from 'uikit'
import { RouterOutputs } from '@penx/api'
import { db } from '@penx/local-db'
import { Manifest } from '@penx/model'
import { api } from '@penx/trpc-client'
import { fetchInstallationJSON } from '~/common/fetchInstallationJSON'
import { useLoadCommands } from '~/hooks/useItems'

type ExtensionItem = RouterOutputs['extension']['all'][0]

interface Props {
  item: ExtensionItem
}

export function InstallExtensionButton({ item }: Props) {
  const manifest = new Manifest(item.manifest as any)

  const { refetch: refetchExtensions } = useQuery({
    queryKey: ['extension', 'installed'],
    queryFn: () => db.listExtensions(),
  })

  const { refetch: refetchCommands } = useLoadCommands()

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['extension', item.id],
    mutationFn: async () => {
      const json = await fetchInstallationJSON(manifest.name)

      if (json) {
        const { name, ...data } = json
        await db.upsertExtension(name, data as any)
        await refetchCommands()
      }
    },
  })

  return (
    <Button
      colorScheme="black"
      w-90
      size="sm"
      disabled={isLoading}
      onClick={async () => {
        try {
          await mutateAsync()
          await refetchExtensions()
          await api.extension.increaseInstallationCount.mutate({
            name: manifest.name,
          })
        } catch (error) {
          console.log('install error', error)
        }
      }}
    >
      {isLoading && <Spinner white square4 />}
      <Box>Install</Box>
    </Button>
  )
}
