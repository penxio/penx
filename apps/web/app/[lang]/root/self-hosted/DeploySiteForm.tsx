'use client'

import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export const DeploySiteForm = () => {
  const [apiToken, setApiToken] = useState<string>('')
  const [cfPermissionRequired, setCfPermissionRequired] = useState<
    { name: string; status: boolean }[]
  >([])
  const { isPending, mutateAsync } = trpc.hostedSite.deployNewSite.useMutation()
  const { data, status } = useSession()
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()

  const omSubmit = async () => {
    if (!apiToken) return
    try {
      const res = await mutateAsync({ apiToken })
      if (res.code === 200) {
        refetch()
        toast.success('Deploy task created!')
        setCfPermissionRequired([
          { name: 'r2', status: true },
          { name: 'd1', status: true },
          { name: 'pages', status: true },
          { name: 'kv', status: true },
        ])
      } else if (res.code === 401) {
        toast.error(res.message)
        setCfPermissionRequired([])
      } else if (res.code === 403) {
        toast.error('Missing cf permissions')
        setCfPermissionRequired(res?.permissionsRequired || [])
      }
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const authenticated = !!data

  if (!authenticated) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="mx-auto w-full max-w-[600px] rounded-md px-10 py-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Deploy your site</h2>

            <div className="text-foreground/60 text-base">
              Deploy your own site to Cloudflare Pages in 10 minutes
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="apiToken" className="text-sm font-medium">
                  API Token
                </label>

                <a
                  href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=[%20%20{%20%20%20%20%22key%22:%20%22d1%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_r2%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_kv_storage%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22page%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22ai%22,%20%20%20%20%22type%22:%20%22read%22%20%20},%20%20{%20%20%20%22key%22:%22workers_scripts%22,%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22account_settings%22,%20%20%20%20%22type%22:%20%22read%22%20%20}%20%20]&name=PenX"
                  target="_blank"
                  className="text-foreground/60 hover:text-foreground/90 flex items-center gap-1 text-sm transition-all hover:scale-105"
                >
                  Create API Token
                  <ExternalLink size={16}></ExternalLink>
                </a>
              </div>
              <Input
                size="lg"
                id="apiToken"
                value={apiToken}
                onChange={(e) => {
                  setApiToken(e.target.value)
                }}
                placeholder="Enter your Cloudflare API token"
              />
            </div>

            <Button
              onClick={omSubmit}
              disabled={isPending}
              size="lg"
              className="w-full"
            >
              {isPending ? <LoadingDots className=""></LoadingDots> : 'Deploy'}
            </Button>

            {cfPermissionRequired.length > 0 && (
              <div className="space-y-2">
                <div className="text-foreground/60">
                  Checking the permissions provided by your API token:
                </div>
                <ul className="space-y-1">
                  {cfPermissionRequired.map((permission) => (
                    <li
                      key={permission.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`${
                          permission.status ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {permission.status ? '✔' : '✘'}
                      </span>
                      <span>{permission.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <DeployLogs userId={data.userId} /> */}
    </div>
  )
}
