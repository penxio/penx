import { useCallback, useEffect, useMemo, useState } from 'react'
import { Database, Loader2, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { AI_SERVICE_HOST } from '@penx/constants'
import { Creation } from '@penx/domain'
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
import { ScrollArea } from '@penx/uikit/ui/scroll-area'
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
  const [isRemoving, setIsRemoving] = useState(false)
  const [builtNodeIds, setBuiltNodeIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Transfer box states
  const [leftItems, setLeftItems] = useState<Set<string>>(new Set()) // Not to build
  const [rightItems, setRightItems] = useState<Set<string>>(new Set()) // To build
  const [toDeleteItems, setToDeleteItems] = useState<Set<string>>(new Set()) // Built items to delete

  // Group creations by struct - memoized to avoid recalculation
  const creationsGroupByStruct = useMemo(() => {
    return creations?.reduce(
      (acc, creation) => {
        const structId = creation.props?.structId || 'unknown'
        if (!acc[structId]) {
          acc[structId] = []
        }
        acc[structId].push(creation)
        return acc
      },
      {} as Record<string, Creation[]>,
    )
  }, [creations])

  const fetchBuiltNodeIds = useCallback(async () => {
    if (!session?.accessToken) return

    setIsLoading(true)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(session.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      }

      const response = await fetch(
        `${AI_SERVICE_HOST}/api/ai/knowledge-base/nodes`,
        {
          method: 'GET',
          headers,
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      if (result.success && result.nodeIds) {
        setBuiltNodeIds(result.nodeIds)
      }
    } catch (error) {
      console.error('Failed to fetch built node IDs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.accessToken])

  useEffect(() => {
    fetchBuiltNodeIds()
    initializeTransferStates()
  }, [session, isOpen])

  const initializeTransferStates = useCallback(() => {
    if (!creations) return

    const allCreationIds = creations.map((c) => c.raw.id)
    const builtCreationIds = allCreationIds.filter((id) =>
      builtNodeIds.includes(id),
    )
    const unbuiltIds = allCreationIds.filter((id) => !builtNodeIds.includes(id))

    // Initially: built items go to right, unbuilt items stay in left
    setRightItems(new Set(builtCreationIds))
    setLeftItems(new Set(unbuiltIds))
    setToDeleteItems(new Set()) // No items marked for deletion initially
  }, [creations, builtNodeIds])

  // Transfer operations - memoized to prevent unnecessary re-renders
  const moveItemToRight = useCallback((itemId: string) => {
    setLeftItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
    setRightItems((prev) => new Set([...prev, itemId]))
    setToDeleteItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId) // Remove from delete list if it was there
      return newSet
    })
  }, [])

  const moveItemToLeft = useCallback(
    (itemId: string) => {
      setRightItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
      setLeftItems((prev) => new Set([...prev, itemId]))

      // If it's a built item, mark it for deletion
      if (builtNodeIds.includes(itemId)) {
        setToDeleteItems((prev) => new Set([...prev, itemId]))
      }
    },
    [builtNodeIds],
  )

  // Group operations - memoized to prevent unnecessary re-renders
  const moveStructToRight = useCallback(
    (structId: string) => {
      const structCreations = creationsGroupByStruct?.[structId] || []
      structCreations.forEach((creation) => {
        moveItemToRight(creation.raw.id)
      })
    },
    [creationsGroupByStruct, moveItemToRight],
  )

  const moveStructToLeft = useCallback(
    (structId: string) => {
      const structCreations = creationsGroupByStruct?.[structId] || []
      structCreations.forEach((creation) => {
        moveItemToLeft(creation.raw.id)
      })
    },
    [creationsGroupByStruct, moveItemToLeft],
  )

  // Calculate statistics - memoized to avoid recalculation
  const totalNodes = useMemo(
    () => (creations?.length || 0) + (structs?.length || 0),
    [creations?.length, structs?.length],
  )

  const nodesWithKnowledgeBase = builtNodeIds.length

  // Memoized calculations for button state
  const actualToBuildCount = useMemo(
    () =>
      Array.from(rightItems).filter((id) => !builtNodeIds.includes(id)).length,
    [rightItems, builtNodeIds],
  )

  // Execute changes - build and remove based on transfer states
  const executeChanges = async () => {
    const toBuildIds = Array.from(rightItems)
    const toRemoveIds = Array.from(toDeleteItems)

    // Filter out already built nodes from toBuildIds
    const actualToBuildIds = toBuildIds.filter(
      (id) => !builtNodeIds.includes(id),
    )

    if (actualToBuildIds.length === 0 && toRemoveIds.length === 0) {
      toast.info('No changes to execute')
      return
    }

    setIsBuilding(true)
    setIsRemoving(true)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`
      }

      const results = []

      // Handle deletion first if needed
      if (toRemoveIds.length > 0) {
        const deleteResponse = await fetch(
          `${AI_SERVICE_HOST}/api/ai/knowledge-base/nodes/delete`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              nodeIds: toRemoveIds,
            }),
          },
        )

        if (!deleteResponse.ok) {
          throw new Error(
            `Delete request failed with status ${deleteResponse.status}`,
          )
        }

        const deleteResult = await deleteResponse.json()
        if (deleteResult.success) {
          results.push(`Removed ${deleteResult.deletedCount} items`)
        }
      }

      // Handle building if needed
      if (actualToBuildIds.length > 0) {
        // Prepare nodes to build - only include unbuilt nodes
        const nodesToBuild = [
          ...actualToBuildIds
            .map((id) => creations?.find((c) => c.raw.id === id)?.raw)
            .filter(Boolean),
          ...(structs?.map((struct) => struct.raw) || []),
        ]

        const buildResponse = await fetch(
          `${AI_SERVICE_HOST}/api/ai/embed/upload`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              nodes: nodesToBuild,
            }),
          },
        )

        if (!buildResponse.ok) {
          throw new Error(
            `Build request failed with status ${buildResponse.status}`,
          )
        }

        const buildResult = await buildResponse.json()
        if (buildResult.success) {
          results.push(`Built ${actualToBuildIds.length} items`)
        }
      }

      const message = `Successfully ${results.join(' and ')}.`
      toast.success(message)
      await fetchBuiltNodeIds()

      // Clear the toDeleteItems after successful execution
      setToDeleteItems(new Set())
    } catch (error) {
      console.error('Failed to execute changes:', error)
      toast.error('Failed to execute changes. Please try again.')
    } finally {
      setIsBuilding(false)
      setIsRemoving(false)
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

      <DialogContent className="h-[75vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>Manage your knowledge base</DialogDescription>
        </DialogHeader>

        {/* Knowledge Base Statistics */}
        <div className="h-full w-full">
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
            <div className="flex h-full w-full flex-col">
              {/* Transfer Box */}
              <div className="h-58 grid grid-cols-2 gap-2">
                {/* Left Side - Not to Build */}
                <div className="rounded-lg border">
                  <div className="bg-muted/30 border-b p-2">
                    <h4 className="text-sm font-medium">
                      Available ({leftItems.size})
                    </h4>
                  </div>
                  <ScrollArea className="h-46 p-2">
                    <div className="space-y-3">
                      {Object.entries(creationsGroupByStruct || {}).map(
                        ([structId, structCreations]) => {
                          const struct = structs?.find(
                            (s) => s.raw.id === structId,
                          )
                          const leftItemsInStruct = structCreations.filter(
                            (c) => leftItems.has(c.raw.id),
                          )

                          if (leftItemsInStruct.length === 0) return null

                          return (
                            <div key={structId} className="space-y-1">
                              {/* Struct Header */}
                              <div className="bg-muted/50 flex items-center justify-between rounded p-2">
                                <span className="text-muted-foreground text-xs font-medium">
                                  {struct?.name || 'Unknown Struct'} (
                                  {leftItemsInStruct.length})
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => moveStructToRight(structId)}
                                >
                                  →
                                </Button>
                              </div>

                              {/* Struct Items */}
                              <div className="space-y-1 pl-2">
                                {leftItemsInStruct.map((creation) => {
                                  const isBuilt = builtNodeIds.includes(
                                    creation.raw.id,
                                  )
                                  const isToDelete = toDeleteItems.has(
                                    creation.raw.id,
                                  )

                                  return (
                                    <div
                                      key={creation.raw.id}
                                      className={cn(
                                        'hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded p-1 text-xs transition-colors',
                                        isToDelete &&
                                          'bg-red-50 dark:bg-red-900/20',
                                      )}
                                      onClick={() =>
                                        moveItemToRight(creation.raw.id)
                                      }
                                    >
                                      <div
                                        className={cn(
                                          'h-2 w-2 rounded-full',
                                          isBuilt
                                            ? 'bg-green-500'
                                            : 'bg-gray-300',
                                        )}
                                      />
                                      <span
                                        className={cn(
                                          'flex-1 truncate',
                                          isToDelete &&
                                            'text-red-600 line-through dark:text-red-400',
                                        )}
                                      >
                                        {creation.title || 'Untitled'}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Side - To Build */}
                <div className="rounded-lg border">
                  <div className="bg-muted/30 border-b p-2">
                    <h4 className="text-sm font-medium">
                      Knowledge Base ({rightItems.size})
                    </h4>
                  </div>
                  <ScrollArea className="h-48 p-2">
                    <div className="space-y-3">
                      {Object.entries(creationsGroupByStruct || {}).map(
                        ([structId, structCreations]) => {
                          const struct = structs?.find(
                            (s) => s.raw.id === structId,
                          )
                          const rightItemsInStruct = structCreations.filter(
                            (c) => rightItems.has(c.raw.id),
                          )

                          if (rightItemsInStruct.length === 0) return null

                          return (
                            <div key={structId} className="space-y-1">
                              {/* Struct Header */}
                              <div className="bg-muted/50 flex items-center justify-between rounded p-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => moveStructToLeft(structId)}
                                >
                                  ←
                                </Button>
                                <span className="text-muted-foreground text-xs font-medium">
                                  {struct?.name || 'Unknown Struct'} (
                                  {rightItemsInStruct.length})
                                </span>
                              </div>

                              {/* Struct Items */}
                              <div className="space-y-1 pl-2">
                                {rightItemsInStruct.map((creation) => {
                                  const isBuilt = builtNodeIds.includes(
                                    creation.raw.id,
                                  )

                                  return (
                                    <div
                                      key={creation.raw.id}
                                      className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded p-1 text-xs transition-colors"
                                      onClick={() =>
                                        moveItemToLeft(creation.raw.id)
                                      }
                                    >
                                      <div
                                        className={cn(
                                          'h-2 w-2 rounded-full',
                                          isBuilt
                                            ? 'bg-green-500'
                                            : 'bg-gray-300',
                                        )}
                                      />
                                      <span className="flex-1 truncate">
                                        {creation.title || 'Untitled'}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="mt-2 w-full flex-1 ">
                <Button
                  size="xs"
                  onClick={executeChanges}
                  disabled={
                    isBuilding ||
                    isRemoving ||
                    (actualToBuildCount === 0 && toDeleteItems.size === 0)
                  }
                  className="w-full"
                >
                  {isBuilding || isRemoving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Execute Changes ({actualToBuildCount} build,{' '}
                      {toDeleteItems.size} remove)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

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
