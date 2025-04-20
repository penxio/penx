import { useSiteContext } from '@penx/contexts/SiteContext'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/ui/avatar'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'
import { trpc } from '@penx/trpc-client'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

interface Props {
  token: string
  value: string
  onChange: (value: string) => void
}

export function GithubInstallationSelect({ token, value, onChange }: Props) {
  const site = useSiteContext()
  const { data: installations, isLoading: isLoadInstallations } =
    trpc.github.appInstallations.useQuery({
      token,
    })

  // console.log('installations:', installations)

  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME
  const newAppURL = `https://github.com/apps/${appName}/installations/new?state=${site.id}`

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select a account"></SelectValue>
      </SelectTrigger>
      <SelectContent className="">
        {installations?.map((item) => (
          <SelectItem
            className="flex items-center gap-1"
            key={item.installationId}
            value={item.installationId.toString()}
          >
            <div className="flex w-40 items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={item.avatarUrl} />
                <AvatarFallback>{item.accountName}</AvatarFallback>
              </Avatar>
              <div>{item.accountName}</div>
            </div>
          </SelectItem>
        ))}

        <MenuItem
          className="gap-1"
          onClick={() => {
            location.href = newAppURL
          }}
        >
          <div className="text-foreground/600 inline-flex">
            <Plus size={20} />
          </div>
          <div>Add GitHub Account</div>
        </MenuItem>
      </SelectContent>
    </Select>
  )
}
