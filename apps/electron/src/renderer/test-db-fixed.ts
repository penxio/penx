import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'

// Test database connection and basic operations
export async function testDatabaseConnectionFixed() {
  console.log('Testing database connection with fixed implementation...')

  try {
    const db = createProxyClient('http://localhost:14158')

    // Test simple query first
    console.log('Testing simple select query...')
    const allNodes = await db.select().from(nodes)
    console.log('All nodes result:', allNodes)
    console.log('Result type:', typeof allNodes)
    console.log('Is array:', Array.isArray(allNodes))

    if (Array.isArray(allNodes)) {
      console.log('✅ Query successful - result is an array')
      console.log('Number of nodes:', allNodes.length)
    } else {
      console.log('❌ Query failed - result is not an array')
      console.log('Result:', allNodes)
    }

    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}

// Run test in browser console
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testDatabaseConnectionFixed = testDatabaseConnectionFixed
}
