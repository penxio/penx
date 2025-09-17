interface Health {
  status: 'ok'
  timestamp: string
  uptime: number
}

export async function waitForHealth(): Promise<boolean> {
  const url = 'http://localhost:14158/health'
  const maxWaitTime = 3000 // 3 seconds
  const interval = 20 // 20 milliseconds
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch(url)
      
      if (response.status === 200) {
        const data: Health = await response.json()
        if (data.status === 'ok') {
          return true
        }
      }
    } catch (error) {
      // Ignore network errors and continue retrying
    }
    
    // Wait 20 milliseconds before retrying
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  return false
}
