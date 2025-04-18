import { useRef, useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import type { ImportResult } from '@/server/routers/subscriber'
import { HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ImportSubscribersDialog } from './ImportSubscribersDialog'

interface Props {
  className?: string
}

const SAMPLE_JSON = [{ email: 'user@example.com' }]

export const ImportSubscribersButton = ({ className, ...rest }: Props) => {
  const site = useSiteContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleFile = async (file: File) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        setIsImporting(true)
        const result = await api.subscriber.importSubscribers.mutate({
          siteId: site.id,
          subscribers: jsonData,
        })

        setImportResult(result)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        toast.error(
          extractErrorMessage(error) || 'Failed to import subscribers',
        )
      } finally {
        setIsImporting(false)
      }
    }

    reader.readAsText(file)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    event.target.value = ''
  }

  return (
    <>
      <div {...rest} className={cn('flex items-center gap-2', className)}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="text-muted-foreground h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-[300px]"
              sideOffset={10}
            >
              <div className="space-y-2 text-sm">
                <p>Import subscribers from a JSON file with the format:</p>
                <pre className="bg-muted rounded p-2 text-xs">
                  {JSON.stringify(SAMPLE_JSON, null, 2)}
                </pre>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button onClick={() => fileInputRef.current?.click()}>Import</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <ImportSubscribersDialog
        result={importResult}
        onOpenChange={() => {
          setImportResult(null)
          setIsImporting(false)
        }}
        isImporting={isImporting}
      />
    </>
  )
}
