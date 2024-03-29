import { Box } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Button, modalController, Spinner } from 'uikit'
import { ModalNames } from '@penx/constants'
import { api, trpc } from '@penx/trpc-client'
import { DeleteSyncServerModal } from './DeleteSyncServerModal'

export function SyncServerList() {
  const { isLoading, data = [] } = trpc.syncServer.mySyncServers.useQuery()

  if (isLoading) {
    return (
      <Box toCenter h-60vh>
        <Spinner />
      </Box>
    )
  }

  return (
    <Box mt10>
      <Box column gap1>
        {data?.map((item) => (
          <Box key={item.id} toCenterY gap2>
            <Box textLG>{item.name}</Box>
            <Box gray500 textSM>
              {item.token}
            </Box>

            <Button
              isSquare
              size={28}
              variant="light"
              onClick={() => {
                modalController.open(ModalNames.SYNC_SERVER, {
                  isEditing: true,
                  isLoading: false,
                  syncServer: item,
                })
              }}
            >
              <Pencil size={16}></Pencil>
            </Button>
            <DeleteSyncServerModal syncServerId={item.id} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
