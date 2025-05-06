import { Trans } from '@lingui/react'
import { useQuery } from '@tanstack/react-query'
import { ask, open } from '@tauri-apps/plugin-dialog'
import { get, set } from 'idb-keyval'
import { toast } from 'sonner'
import { LOCAL_AUTO_BACKUP_DIR } from '@penx/constants'
import { getOrInitLocalBackupDir } from '@penx/libs/getOrInitLocalBackupDir'
import { Panel } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { ClosePanelButton } from '../../ClosePanelButton'
import { PanelHeaderWrapper } from '../../PanelHeaderWrapper'
import { BackupInterval } from './BackupInterval'

const DEFAULT_BACKUP_DIR = 'penx-auto-backup'

interface Props {
  panel: Panel
  index: number
}

export const LocalBackup = ({ panel, index }: Props) => {
  const {
    data = '',
    refetch,
    error,
  } = useQuery({
    queryKey: [LOCAL_AUTO_BACKUP_DIR],
    queryFn: async () => {
      return await getOrInitLocalBackupDir()
    },
  })

  return (
    <>
      <PanelHeaderWrapper index={index}>
        <div>
          <Trans id="Local backup"></Trans>
        </div>
        <ClosePanelButton panel={panel} />
      </PanelHeaderWrapper>
      <div className="flex flex-col gap-4 p-4">
        <div className="text-foreground/50 text-sm">
          A backup file of all data is automatically created.
        </div>
        <div className="bg-foreground/10 flex h-10 items-center rounded border px-3">
          {data}
        </div>

        <div>
          <Button
            onClick={async () => {
              const { documentDir, homeDir } = await import(
                '@tauri-apps/api/path'
              )
              try {
                const selected = await open({
                  multiple: false,
                  directory: true,
                  defaultPath: await documentDir(),
                  filters: [],
                })

                console.log('=======selected:', selected)

                await set(LOCAL_AUTO_BACKUP_DIR, selected as string)
                refetch()
              } catch (err) {
                console.error(err)
              }
            }}
          >
            Change Location
          </Button>
        </div>

        <BackupInterval />
        {/* <BackupHistory /> */}
      </div>
    </>
  )
}
