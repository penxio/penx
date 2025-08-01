import React, { useEffect, useState } from 'react'
import { useDatabase } from '../hooks/useDatabase'

export const DatabaseHookExample: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([])
  const {
    loading,
    error,
    getAllNodes,
    insertNode,
    updateNode,
    deleteNode,
    clearError,
  } = useDatabase()

  const fetchNodes = async () => {
    const result = await getAllNodes()
    if (result) {
      setNodes(result as any)
    }
  }

  const handleAddNode = async () => {
    const result = await insertNode({
      type: 'text',
      props: {
        title: `Node ${Date.now()}`,
        content: 'This is a new node',
      },
      userId: 'test-user-id',
      spaceId: 'test-space-id',
    })

    if (result) {
      await fetchNodes()
    }
  }

  const handleUpdateNode = async (id: string) => {
    const result = await updateNode(id, {
      props: {
        title: `Updated Node ${Date.now()}`,
        content: 'This node has been updated',
      },
    })

    if (result) {
      await fetchNodes()
    }
  }

  const handleDeleteNode = async (id: string) => {
    const result = await deleteNode(id)
    if (result) {
      await fetchNodes()
    }
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Database Hook Example</h2>

      {error && (
        <div
          style={{
            color: 'red',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid red',
            borderRadius: '4px',
          }}
        >
          Error: {error}
          <button onClick={clearError} style={{ marginLeft: '10px' }}>
            Clear Error
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAddNode}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add New Node
        </button>

        <button
          onClick={fetchNodes}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      <h3>Nodes ({nodes.length})</h3>
      <div>
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              border: '1px solid #ddd',
              margin: '10px 0',
              padding: '15px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <strong>ID:</strong> {node.id}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Type:</strong> {node.type}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Props:</strong> {JSON.stringify(node.props)}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Created:</strong>{' '}
              {new Date(node.createdAt).toLocaleString()}
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleUpdateNode(node.id)}
                style={{
                  padding: '5px 10px',
                  marginRight: '10px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Update
              </button>

              <button
                onClick={() => handleDeleteNode(node.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {nodes.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
          }}
        >
          No nodes found. Click "Add New Node" to create one.
        </div>
      )}
    </div>
  )
}
