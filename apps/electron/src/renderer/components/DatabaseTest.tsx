import React, { useEffect, useState } from 'react'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'

export const DatabaseTest: React.FC = () => {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testQuery = async () => {
    try {
      setLoading(true)
      setError(null)

      const db = createProxyClient('http://localhost:14158')
      const allNodes = await db.select().from(nodes)

      setResult({
        data: allNodes,
        type: typeof allNodes,
        isArray: Array.isArray(allNodes),
        length: Array.isArray(allNodes) ? allNodes.length : 'N/A',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testQuery()
  }, [])

  if (loading) {
    return <div>Testing database connection...</div>
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>Error:</h3>
        <p>{error}</p>
        <button onClick={testQuery}>Retry</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Database Test Results</h2>
      <button onClick={testQuery}>Test Again</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Query Results:</h3>
          <p>
            <strong>Type:</strong> {result.type}
          </p>
          <p>
            <strong>Is Array:</strong> {result.isArray ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Length:</strong> {result.length}
          </p>

          <h4>Data:</h4>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px',
            }}
          >
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
