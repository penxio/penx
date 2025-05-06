import { Box } from '@fower/react'
import { useMutation } from '@tanstack/react-query'
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs'
import {
  Button,
  modalController,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  toast,
  usePopoverContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { DriveFile, GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { decryptByMnemonic } from '@penx/mnemonic'
import { User } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'
import { normalizeNodes } from '@penx/shared'
import { getAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'

interface Props {
  path: string
}

export function RestoreButton({ path }: Props) {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          Restore
        </Button>
      </PopoverTrigger>
      <PopoverContent p5 column gap2 maxW-360>
        <Box textLG fontSemibold leadingNone>
          Restore from local backup
        </Box>
        <Box gray500>It will replace your local data with backup data</Box>
        <Box toCenterY gap3>
          <PopoverClose asChild>
            <Button colorScheme="white">Cancel</Button>
          </PopoverClose>
          <ConfirmButton path={path} />
        </Box>
      </PopoverContent>
    </Popover>
  )
}

function ConfirmButton({ path }: Props) {
  const { mutateAsync, isLoading } = useMutation(
    ['restore_from_local_backup', path],
    async () => {
      const { resolve } = await import('@tauri-apps/api/path')
      const content = await readTextFile(await resolve(path))

      const nodes = JSON.parse(content || '[]') as INode[]
      if (!nodes || !nodes.length) return
      const spaceId = nodes[0].spaceId

      await db.deleteNodeBySpaceId(spaceId)

      for (const item of nodes) {
        await db.createNode({ ...item })
      }
    },
  )
  const { close } = usePopoverContext()

  return (
    <Button
      disabled={isLoading}
      gap2
      onClick={async () => {
        try {
          await mutateAsync()
          close()

          toast.success('Restored from local backup successfully!')
        } catch (error: any) {
          toast.error(error.message)
          console.log('error:', error)
        }
      }}
    >
      {isLoading && <Spinner square4 white />}
      <Box>Confirm</Box>
    </Button>
  )
}
