# PenX Database Package

This package provides database functionality for Electron applications, supporting both main process and renderer process usage.

## Features

- Uses PGLite as local database
- Supports Drizzle Proxy for direct database access in renderer process
- Type-safe database operations
- Automatic migration and schema management

## Usage

### In Main Process

```typescript
import { client } from '@penx/db'
import { nodes } from '@penx/db'

// Use database client directly
const allNodes = await client.select().from(nodes)
```

### In Renderer Process

```typescript
import { createProxyClient, nodes } from '@penx/db'
import { eq } from 'drizzle-orm'

// Create proxy client
const db = createProxyClient('http://localhost:14158')

// Query data
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

### Using Wrapped Class

```typescript
import { useRendererDB } from './db-example'

const db = useRendererDB()

// Get all nodes
const nodes = await db.getAllNodes()

// Get node by ID
const node = await db.getNodeById('node-id')

// Insert new node
await db.insertNode({
  type: 'test',
  props: { title: 'Test Node' },
  userId: 'user-id',
  spaceId: 'space-id',
})
```

## Architecture

1. **Main Process**: Uses PGLite to connect to database directly
2. **Renderer Process**: Accesses database through HTTP proxy
3. **Hono Server**: Provides `/api/query` endpoint to handle database queries

## Development Notes

1. Ensure Hono server is running on port 14158
2. Database operations in renderer process are sent to main process via HTTP requests
3. All database operations are type-safe
4. Supports full Drizzle ORM functionality including query, insert, update, delete, etc.

## Error Handling

The proxy client automatically handles network errors and database errors, returning empty arrays or throwing exceptions if errors occur.

## Performance Considerations

- Database operations in renderer process have network latency
- For large data operations, it's recommended to perform them in main process
- Caching can be used to optimize frequent query operations 