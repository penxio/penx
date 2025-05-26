import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface PageViewOptions {
  creationId: string
}

/**
 * Hook for tracking page views
 * Records a page view when the component mounts
 * Uses sessionStorage to maintain a consistent session ID
 * Silently handles errors to prevent user-facing issues
 */
export function usePostEngagement({ creationId }: PageViewOptions) {
  // Use a single ref object to store tracking data
  const trackingData = useRef({
    sessionId: '',
  })

  useEffect(() => {
    // Skip execution during server-side rendering
    if (typeof window === 'undefined') return

    const data = trackingData.current

    // Initialize session ID from sessionStorage or generate a new one
    data.sessionId = sessionStorage.getItem('view_session_id') || uuidv4()
    sessionStorage.setItem('view_session_id', data.sessionId)

    // Silently record page view without affecting user experience
    // Errors are caught and logged but not propagated to the UI
    // api.creationEngagement.recordPageView
    //   .mutate({
    //     creationId: creationId,
    //     sessionId: data.sessionId,
    //   })
    //   .catch((err) => {
    //     // Log error for debugging but don't affect user experience
    //     console.error('Failed to record page view:', err)
    //   })
  }, [creationId])

  return trackingData.current
}
