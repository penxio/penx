# Electron Database Usage Guide

This guide explains how to use database functionality in PenX Electron application, including usage in both main process and renderer process.

## Architecture Overview

```
┌─────────────────┐    HTTP Request    ┌─────────────────┐
│   Renderer      │ ──────────────────► │   Main Process  │
│   Process       │                     │   (Hono Server) │
│                 │ ◄────────────────── │                 │
└─────────────────┘    JSON Response   └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   PGLite DB     │
                                    │   (Local File)  │
                                    └─────────────────┘
```

## Quick Start

### 1. Using Database in Renderer Process

```typescript
import { createProxyClient, nodes } from '@penx/db'
import { eq } from 'drizzle-orm'

// Create proxy client
const db = createProxyClient('http://localhost:14158')

// Query all nodes
const allNodes = await db.select().from(nodes)

// Conditional query
const specificNode = await db.select().from(nodes).where(eq(nodes.id, 'node-id'))

// Insert data
await db.insert(nodes).values({
  type: 'test',
  props: { title: 'Test Node' },
  userId: 'user-id',
  spaceId: 'space-id',
  createdAt: new Date(),
  updatedAt: new Date(),
})
```

### 2. Using Wrapped Class

```typescript
import { useRendererDB } from './db-example'

const db = useRendererDB()

// Get all nodes
const nodes = await db.getAllNodes()

// Insert new node
await db.insertNode({
  type: 'test',
  props: { title: 'Test Node' },
  userId: 'user-id',
  spaceId: 'space-id',
})
```

### 3. Using in React Component

```typescript
import React, { useEffect, useState } from 'react'
import { useRendererDB } from './db-example'

export const MyComponent: React.FC = () => {
  const [nodes, setNodes] = useState([])
  const db = useRendererDB()

  useEffect(() => {
    const fetchNodes = async () => {
      const result = await db.getAllNodes()
      setNodes(result)
    }
    fetchNodes()
  }, [])

  return (
    <div>
      {nodes.map(node => (
        <div key={node.id}>{node.type}</div>
      ))}
    </div>
  )
}
```

## Database Schema

### Nodes Table Structure

```typescript
export const nodes = pgTable('node', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  type: text('type').notNull(),
  props: jsonb('props').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  areaId: uuid('area_id'),
  userId: uuid('user_id').notNull(),
  spaceId: uuid('space_id').notNull(),
})
```

## Common Operation Examples

### Query Operations

```typescript
// Query all nodes
const allNodes = await db.select().from(nodes)

// Query by ID
const node = await db.select().from(nodes).where(eq(nodes.id, 'node-id'))

// Query by type
const textNodes = await db.select().from(nodes).where(eq(nodes.type, 'text'))

// Query by user ID
const userNodes = await db.select().from(nodes).where(eq(nodes.userId, 'user-id'))

// Paginated query
const paginatedNodes = await db.select().from(nodes).limit(10).offset(0)
```

### Insert Operations

```typescript
// Insert single node
await db.insert(nodes).values({
  type: 'text',
  props: { content: 'Hello World' },
  userId: 'user-id',
  spaceId: 'space-id',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Batch insert
await db.insert(nodes).values([
  {
    type: 'text',
    props: { content: 'Node 1' },
    userId: 'user-id',
    spaceId: 'space-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: 'text',
    props: { content: 'Node 2' },
    userId: 'user-id',
    spaceId: 'space-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])
```

### Update Operations

```typescript
// Update node
await db.update(nodes)
  .set({ 
    props: { content: 'Updated content' },
    updatedAt: new Date()
  })
  .where(eq(nodes.id, 'node-id'))
```

### Delete Operations

```typescript
// Delete node
await db.delete(nodes).where(eq(nodes.id, 'node-id'))

// Delete all nodes for a user
await db.delete(nodes).where(eq(nodes.userId, 'user-id'))
```

## Error Handling

```typescript
try {
  const result = await db.select().from(nodes)
  console.log('Query successful:', result)
} catch (error) {
  console.error('Database error:', error)
  // Handle error
}
```

## Performance Optimization

1. **Use Indexes**: Database has created indexes for commonly used fields
2. **Pagination**: Use `limit` and `offset` for large datasets
3. **Caching**: Cache frequently queried data on frontend
4. **Batch Operations**: Use batch insert/update for multiple operations

## Testing

Run test script to verify database connection:

```typescript
import { testDatabaseConnection } from './test-db'

// Run in browser console
await testDatabaseConnection()
```

## Notes

1. Ensure Hono server is running on port 14158
2. Database operations in renderer process have network latency
3. All database operations are type-safe
4. Supports full Drizzle ORM functionality
5. Database files are stored in user data directory

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check if Hono server is running
2. **Type Errors**: Ensure correct TypeScript types are used
3. **Permission Errors**: Check database file permissions
4. **Performance Issues**: Consider caching or query optimization

### Debugging

1. Check network requests in browser console
2. Check main process log output
3. Use test script to verify connection
4. Check if database file exists 