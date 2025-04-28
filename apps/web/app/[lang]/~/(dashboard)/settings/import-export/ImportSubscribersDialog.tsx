import { CheckCircle2, Loader2 } from 'lucide-react'
import { ImportResult } from '@penx/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'

interface ImportSubscribersDialogProps {
  result: ImportResult | null
  onOpenChange: (open: boolean) => void
  isImporting?: boolean
}

export function ImportSubscribersDialog({
  result,
  onOpenChange,
  isImporting,
}: ImportSubscribersDialogProps) {
  const total = result?.total ?? 0

  return (
    <Dialog open={!!result || isImporting} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isImporting ? 'Importing Subscribers...' : 'Import Result'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isImporting ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Importing subscribers...
              </p>
            </div>
          ) : (
            result && (
              <>
                {result.success > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-700">
                      Successfully imported {result.success} subscribers
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-border bg-muted/10 rounded-lg border p-3 text-center">
                    <div className="text-muted-foreground text-sm font-medium">
                      Total
                    </div>
                    <div className="text-2xl font-semibold">{total}</div>
                  </div>
                  <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-center">
                    <div className="text-sm font-medium text-green-600">
                      Success
                    </div>
                    <div className="text-2xl font-semibold text-green-700">
                      {result.success}
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center">
                    <div className="text-sm font-medium text-red-600">
                      Failed
                    </div>
                    <div className="text-2xl font-semibold text-red-700">
                      {result.failed.length}
                    </div>
                  </div>
                </div>

                {result.failed.length > 0 && (
                  <div className="rounded-lg border border-red-100 bg-red-50/30">
                    <div className="border-b border-red-100 px-4 py-2 text-sm font-medium text-red-900">
                      Failed Records ({result.failed.length})
                    </div>
                    <div className="max-h-[240px] overflow-auto p-2">
                      {result.failed.map((f, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 rounded-md bg-white p-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-medium text-gray-900">
                              {f.email}
                            </span>
                            <span className="shrink-0 text-xs text-red-500">
                              #{i + 1}
                            </span>
                          </div>
                          <div className="text-xs text-red-600">
                            Error: {f.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
