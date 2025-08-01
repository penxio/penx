import { useCallback, useState } from 'react'
import { eq } from 'drizzle-orm'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'

export const useDatabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const db = createProxyClient('http://localhost:14158')

  const executeQuery = useCallback(
    async <T>(queryFn: () => Promise<T>): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)
        const result = await queryFn()
        return result
      } catch (err: any) {
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const getAllNodes = useCallback(async () => {
    return await executeQuery(() => db.select().from(nodes))
  }, [executeQuery])

  const getNodeById = useCallback(
    async (id: string) => {
      return await executeQuery(() =>
        db.select().from(nodes).where(eq(nodes.id, id)),
      )
    },
    [executeQuery],
  )

  const getNodesByType = useCallback(
    async (type: string) => {
      return await executeQuery(() =>
        db.select().from(nodes).where(eq(nodes.type, type)),
      )
    },
    [executeQuery],
  )

  const insertNode = useCallback(
    async (nodeData: {
      type: string
      props: any
      userId: string
      spaceId: string
      areaId?: string
    }) => {
      return await executeQuery(() =>
        db.insert(nodes).values({
          ...nodeData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      )
    },
    [executeQuery],
  )

  const updateNode = useCallback(
    async (id: string, updates: Partial<typeof nodes.$inferInsert>) => {
      return await executeQuery(() =>
        db
          .update(nodes)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(nodes.id, id)),
      )
    },
    [executeQuery],
  )

  const deleteNode = useCallback(
    async (id: string) => {
      return await executeQuery(() => db.delete(nodes).where(eq(nodes.id, id)))
    },
    [executeQuery],
  )

  return {
    loading,
    error,
    getAllNodes,
    getNodeById,
    getNodesByType,
    insertNode,
    updateNode,
    deleteNode,
    clearError: () => setError(null),
  }
}
