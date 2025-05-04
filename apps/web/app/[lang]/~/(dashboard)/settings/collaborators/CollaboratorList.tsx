import { useState } from 'react'
import { toast } from 'sonner'
import { isAddress } from 'viem'
import {
  Account,
  Collaborator,
  CollaboratorRole,
  ProviderType,
  User,
} from '@penx/db/client'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { api, trpc } from '@penx/trpc-client'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { LoadingDots } from '@penx/uikit/loading-dots'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/table'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface Props {}

export default function CollaboratorList({}: Props) {
  const { site } = useQuerySite()
  const { isLoading, data: collaborators = [], refetch } = useCollaborators()

  console.log('======collaborators:', collaborators)

  return (
    <div className="flex flex-col">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="pr-0 text-right">Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <LoadingDots className="bg-foreground/60" />
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            collaborators?.map((item) => (
              <TableRow key={item.id} className="text-muted-foreground">
                <TableCell className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={item.user.image!} />
                    <AvatarFallback>
                      {item.user.name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">
                      {isAddress(item.user.name || '')
                        ? item.user?.name?.slice(0, 5)
                        : item.user.name}
                    </div>
                    <div className="text-foreground/60 text-sm">
                      {item.user.email && <div>{item.user.email}</div>}
                      {getAddresses(item.user.accounts).map((address) => (
                        <div key={address}>{address}</div>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <SelectRole collaborator={item} />
                </TableCell>
                <TableCell className="flex justify-end space-x-3">
                  <ConfirmDialog
                    title="Delete Confirmation"
                    content="Are you sure you want to delete this item? This action cannot be undone."
                    onConfirm={async () => {
                      await api.collaborator.deleteCollaborator.mutate({
                        collaboratorId: item.id,
                        siteId: site.id,
                      })
                      await refetch()
                      toast.success('Contributor deleted successfully!')
                    }}
                    tooltipContent={'Remove collaborator'}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface SelectRoleProps {
  collaborator: Collaborator
}
function SelectRole({ collaborator }: SelectRoleProps) {
  const { site } = useQuerySite()
  const [role, setRole] = useState(collaborator.role)
  const { refetch } = useCollaborators()

  return (
    <Select
      value={role}
      onValueChange={async (value) => {
        setRole(value as CollaboratorRole)
        try {
          await api.collaborator.updateCollaborator.mutate({
            collaboratorId: collaborator.id,
            siteId: site.id,
            role: value as CollaboratorRole,
          })
          await refetch()
          toast.success('Collaborator role updated successfully!')
        } catch (error) {
          toast.error(extractErrorMessage(error) || 'Failed to update role!')
        }
      }}
    >
      <SelectTrigger className="w-24">
        <SelectValue placeholder={role.toLowerCase()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CollaboratorRole.READ}>
          {CollaboratorRole.READ.toLowerCase()}
        </SelectItem>
        <SelectItem value={CollaboratorRole.WRITE}>
          {CollaboratorRole.WRITE.toLowerCase()}
        </SelectItem>
        <SelectItem value={CollaboratorRole.ADMIN}>
          {CollaboratorRole.ADMIN.toLowerCase()}
        </SelectItem>
        <SelectItem value={CollaboratorRole.OWNER}>
          {CollaboratorRole.OWNER.toLowerCase()}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

function getAddresses(accounts: Account[] = []) {
  return accounts
    .filter((account) => account.providerType === ProviderType.WALLET)
    .map((account) => account.providerAccountId)
}
