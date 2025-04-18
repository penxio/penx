import { useEffect, useRef, useState } from 'react'

const logApi = 'http://localhost:9000/deploy-log'

export const DeployLogs = ({ userId }: { userId: string }) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const [deployLogs, setDeployLogs] = useState<string>('')

  useEffect(() => {
    if (!eventSourceRef.current) {
      createEventSource()
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

  const createEventSource = () => {
    const eventSource = new EventSource(`${logApi}`, { withCredentials: false })
    eventSourceRef.current = eventSource

    eventSource.onmessage = ({ data }) => {
      try {
        const parsedData = JSON.parse(data)?.data
        console.log('%c=log', 'color:red', parsedData)

        if (parsedData?.type === 'close') {
          eventSource.close()
          eventSourceRef.current = null
        } else if (parsedData?.type === 'deployLog') {
          const logText = parsedData?.content || ''
          setDeployLogs((prev) => prev + logText)
        }
      } catch (error) {
        console.error('Failed to parse data:', error, data)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      eventSourceRef.current = null
      eventSource.close()
    }
  }

  return (
    <div className="mx-4">
      Deploy Logs:
      <div className="h-[800px] overflow-auto rounded-md bg-black/80 p-4 text-white">
        <div className="font-mono text-sm">
          <pre>{deployLogs}</pre>
        </div>
      </div>
    </div>
  )
}
