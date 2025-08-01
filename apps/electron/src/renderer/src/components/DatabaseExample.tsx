import React, { useEffect, useState } from 'react'
import { nodes } from '@penx/db'
import { Button } from '@penx/uikit/ui/button'
import { uniqueId } from '@penx/unique-id'
import { useRendererDB } from '../lib/proxy-pg'

export const DatabaseExample: React.FC = () => {
  const [allNodes, setAllNodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const db = useRendererDB()

  const fetchNodes = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await db.getAllNodes()
      setAllNodes(result)
    } catch (err: any) {
      console.log('==========err:', err)

      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTestNode = async () => {
    try {
      await db.insertNode({
        type: 'test',
        props: { title: 'Test Node', content: 'This is a test node' },
        areaId: uniqueId(),
        userId: uniqueId(),
        spaceId: uniqueId(),
      })
      // Refresh data
      await fetchNodes()
    } catch (err: any) {
      console.log('======err:', err)

      setError(err.message)
    }
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  if (loading) {
    return <div>Loading nodes...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="no-drag mt-20">
      <h2>Database Example</h2>
      <Button onClick={addTestNode}>Add Test Node</Button>
      <Button onClick={fetchNodes}>Refresh</Button>

      <h3>All Nodes ({allNodes.length})</h3>
      <div>
        {allNodes.map((node) => (
          <div
            key={node.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
            }}
          >
            <pre>{JSON.stringify(node, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
