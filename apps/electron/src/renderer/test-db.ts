import { eq } from 'drizzle-orm'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'

// Test database connection and basic operations
export async function testDatabaseConnection() {
  console.log('Testing database connection...')

  try {
    const db = createProxyClient('http://localhost:14158')

    // Test query all nodes
    console.log('Testing select all nodes...')
    const allNodes = await db.select().from(nodes)
    console.log('All nodes:', allNodes)

    // Test insert node
    console.log('Testing insert node...')
    const insertResult = await db.insert(nodes).values({
      type: 'test',
      props: { title: 'Test Node', content: 'This is a test node' },
      userId: 'test-user-id',
      spaceId: 'test-space-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('Insert result:', insertResult)

    // Query all nodes again
    console.log('Testing select all nodes after insert...')
    const allNodesAfterInsert = await db.select().from(nodes)
    console.log('All nodes after insert:', allNodesAfterInsert)

    console.log('Database connection test completed successfully!')
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Run test in browser console
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testDatabaseConnection = testDatabaseConnection
}
