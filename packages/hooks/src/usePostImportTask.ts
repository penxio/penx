import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

// Define the maximum number of polling attempts to prevent infinite polling
const INITIAL_POLL_INTERVAL = 3000 // Start with 3 second interval
const MAX_POLL_INTERVAL = 5000 // Maximum 5 second interval
const ADAPTIVE_THRESHOLD = 30 // Switch to longer interval after this many attempts

export type ImportTaskStatus =
  | 'pending' // Waiting to be processed
  | 'extracting' // Extracting web content
  | 'analyzing' // Analyzing content
  | 'converting' // Converting format
  | 'completed' // Task completed
  | 'failed' // Task failed

export interface ImportPostData {
  title: string
  content: string
  contentFormat?: 'html' | 'markdown' | 'plate' // Format of the content
  url?: string
}

export interface ImportTask {
  id: string
  url: string
  spaceId: string
  status: ImportTaskStatus
  progress: number
  error?: string
  total?: number // Total number of items to parse
  result?: ImportPostData[]
  createdAt: Date
  updatedAt: Date
}

// Status message mapping
const STATUS_MESSAGES = {
  pending: 'Waiting to process...',
  extracting: 'Extracting content from URL...',
  analyzing: 'Analyzing content...',
  converting: 'Converting to posts...',
  completed: 'Import completed!',
  failed: 'Import failed',
}

export function useImportTask() {
  const site = useSiteContext()
  const [importTask, setImportTask] = useState<ImportTask | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const startTimeRef = useRef<number>(0)

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      clearPolling()
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  // Clear polling interval
  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  // Start polling for task status
  const startPolling = (taskId: string) => {
    pollingAttemptsRef.current = 0
    startTimeRef.current = Date.now()

    const poll = async () => {
      try {
        // Calculate elapsed time in seconds
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        )
        const maxWaitTimeSeconds = 360 // 6 minutes

        // Check if we should continue polling
        if (document.hidden || elapsedSeconds >= maxWaitTimeSeconds) {
          clearPolling()
          setIsLoading(false)
          if (elapsedSeconds >= maxWaitTimeSeconds) {
            setImportTask((prev) =>
              prev
                ? {
                    ...prev,
                    status: 'failed',
                    error: 'Import timed out. Please try again.',
                  }
                : null,
            )
            toast.error('Import timed out. Please try again.')
          }
          return
        }

        // Create a new abort controller for this request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        // Get task status
        // const task = await api.creationImport.getImportTaskStatus.query(
        //   { taskId },
        //   { signal: abortControllerRef.current.signal },
        // )

        // setImportTask(task)

        // If the task is completed or failed, stop polling
        // if (task.status === 'completed' || task.status === 'failed') {
        //   clearPolling()
        //   setIsLoading(false)

        //   if (task.status === 'completed') {
        //     if (task.result && task.result.length > 0) {
        //       toast.success(`Found ${task.result.length} posts from URL`)
        //     } else {
        //       toast.info('No content was found to import')
        //     }
        //   } else {
        //     toast.error(task.error || 'Import failed')
        //   }

        //   return
        // }

        // Continue polling with adaptive interval
        pollingAttemptsRef.current++

        // Calculate appropriate interval based on elapsed time
        let interval = INITIAL_POLL_INTERVAL
        if (pollingAttemptsRef.current > ADAPTIVE_THRESHOLD) {
          interval = MAX_POLL_INTERVAL
        }

        // Log polling information for debugging
        console.log(
          `Polling attempt ${pollingAttemptsRef.current}, elapsed time: ${elapsedSeconds}s, next interval: ${interval}ms`,
        )

        pollingIntervalRef.current = setTimeout(poll, interval)
      } catch (error) {
        // Don't show errors for aborted requests
        if (error.name === 'AbortError') {
          return
        }

        console.error('Error in polling loop:', error)
        clearPolling()
        setIsLoading(false)
        toast.error(
          extractErrorMessage(error) || 'Failed to check import status',
        )
      }
    }

    poll()
  }

  // Create a new import task
  const createImportTask = async (url: string): Promise<any> => {
    clearPolling() // Clear any existing polling
    setIsLoading(true)
    setImportTask(null)
    pollingAttemptsRef.current = 0

    // Abort any existing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      // Submit URL to start import task with abort signal
      // const task = await api.creationImport.createImportTask.mutate(
      //   { spaceId: site.id, url },
      //   { signal: abortControllerRef.current.signal },
      // )

      // setImportTask(task)
      // startPolling(task.id)
      // return true
    } catch (error) {
      // Don't show errors for aborted requests
      if (error.name === 'AbortError') {
        return false
      }

      console.error('Error starting URL import:', error)
      toast.error(extractErrorMessage(error) || 'Failed to start URL import')
      setIsLoading(false)
      return false
    }
  }

  // Get progress percentage and status message
  const getImportProgress = () => {
    if (!importTask) return { progress: 0, message: 'Preparing import...' }

    const message =
      importTask.status === 'failed'
        ? `${STATUS_MESSAGES.failed}: ${importTask.error || 'Unknown error'}`
        : STATUS_MESSAGES[importTask.status]

    return {
      progress: importTask.progress,
      message,
    }
  }

  return {
    importTask,
    isLoading,
    createImportTask,
    getImportProgress,
  }
}
