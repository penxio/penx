import { useEffect, useState } from 'react'
import { Database, Loader2, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { AI_SERVICE_HOST, ROOT_HOST } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { useStructs } from '@penx/hooks/useStructs'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/ui/dialog'
import { Progress } from '@penx/uikit/ui/progress'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}

export function RagSettingDialog({ className }: Props) {
  const { session } = useSession()
  const { creations } = useCreations()
  const { structs } = useStructs()
  const [isBuilding, setIsBuilding] = useState(false)
  const [builtNodeIds, setBuiltNodeIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch built knowledge base node IDs only when dialog opens
  useEffect(() => {
    const fetchBuiltNodeIds = async () => {
      if (!session?.accessToken || !isOpen) return

      setIsLoading(true)
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }

        if (session.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`
        }

        const response = await fetch(
          `${AI_SERVICE_HOST}/api/ai/knowledge-base/nodes`,
          {
            method: 'GET',
            headers,
          },
        )

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.nodeIds) {
            setBuiltNodeIds(result.nodeIds)
          }
        }
      } catch (error) {
        console.error('Failed to fetch built node IDs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    console.log('fetching built node ids')

    fetchBuiltNodeIds()
  }, [session, isOpen]) // Added isOpen as dependency

  // Calculate knowledge base statistics
  const totalCreations = creations?.length || 0
  const totalNodes = totalCreations

  const creationIds = creations?.map((creation) => creation.raw.id) || []
  const structIds = structs?.map((struct) => struct.raw.id) || []
  const allNodeIds = [...creationIds, ...structIds]

  // Calculate intersection between built node IDs and all node IDs (creations + structs)
  const nodesWithKnowledgeBase = allNodeIds.filter((id) =>
    builtNodeIds.includes(id),
  ).length

  const percentage =
    totalNodes > 0 ? Math.round((nodesWithKnowledgeBase / totalNodes) * 100) : 0

  // Handle bulk knowledge base building
  const handleBuildKnowledgeBase = async () => {
    setIsBuilding(true)
    try {
      // Call the embeddings API to build knowledge base for all creations and structs
      const url = AI_SERVICE_HOST + '/api/ai/embed/upload'

      // Prepare headers with authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add Authorization header if session has accessToken
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }

      // Combine creations and structs as nodes
      // Extract the 'raw' field from each creation and struct object
      const nodes = [
        ...(creations?.map((creation) => creation.raw) || []),
        ...(structs?.map((struct) => struct.raw) || []),
      ]

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          nodes: nodes,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()

      toast.success(
        `Knowledge base built successfully! Processed ${result.processedCount} items.`,
      )

      // Refresh built node IDs after building
      try {
        const nodeResponse = await fetch(
          `${AI_SERVICE_HOST}/api/ai/knowledge-base/nodes`,
          {
            method: 'GET',
            headers,
          },
        )

        if (nodeResponse.ok) {
          const nodeResult = await nodeResponse.json()
          if (nodeResult.success && nodeResult.nodeIds) {
            setBuiltNodeIds(nodeResult.nodeIds)
          }
        }
      } catch (nodeError) {
        console.error('Failed to refresh node IDs:', nodeError)
      }
    } catch (error) {
      console.error('Failed to build knowledge base:', error)
      toast.error('Failed to build knowledge base. Please try again.')
    } finally {
      setIsBuilding(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            'text-foreground/90 no-drag bg-foreground/8 hover:bg-foreground/12 flex size-7 items-center justify-center rounded-md',
            className,
          )}
          onClick={() => {}}
        >
          <Settings size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>Manage your knowledge base</DialogDescription>
        </DialogHeader>

        {/* Knowledge Base Statistics */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          ) : (
            // Actual content
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Knowledge Base Status
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {nodesWithKnowledgeBase}/{totalNodes} ({percentage}% built)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-muted-foreground text-xs">
                  {percentage === 0
                    ? 'No knowledge base built yet'
                    : `${percentage}% of nodes have knowledge base built`}
                </p>
              </div>
            </div>
          )}

          {/* One-click Build Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleBuildKnowledgeBase}
              disabled={isBuilding || totalNodes === 0 || isLoading}
              className="flex-1"
              variant="outline"
            >
              {isBuilding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building Knowledge Base...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  {percentage === 0
                    ? 'Build Knowledge Base'
                    : 'Rebuild Knowledge Base'}
                </>
              )}
            </Button>
          </div>

          {totalNodes === 0 && !isLoading && (
            <p className="text-muted-foreground py-2 text-center text-xs">
              No content available. Please create content first to build
              knowledge base.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
