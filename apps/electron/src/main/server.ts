import { existsSync, mkdirSync } from 'fs'
import { Server } from 'http'
import { serve } from '@hono/node-server'
import { app as electronApp } from 'electron'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { client, pg } from '@penx/db/client'
import bookmarkRouter from './routers/bookmark'
import { Windows } from './types'

export interface ServerConfig {
  port: number
  host: string
  isDev: boolean
  dataDir: string
}

export class HonoServer {
  private server: Server | null = null
  private app: Hono

  constructor(
    private config: ServerConfig,
    private windows: Windows,
  ) {
    this.app = new Hono()
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use('*', secureHeaders())
    this.app.use('*', timeout(30000))

    if (this.config.isDev) {
      this.app.use('*', logger())
    }

    this.app.use(
      '*',
      cors({
        origin: ['http://localhost:*', 'app://*'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    )

    this.app.onError((err, c) => {
      console.error('Server error:', err)
      return c.json(
        {
          error: this.config.isDev ? err.message : 'Internal server error',
          timestamp: new Date().toISOString(),
        },
        500,
      )
    })
  }

  private setupRoutes() {
    this.app.get('/health', (c) =>
      c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }),
    )

    this.app.get('/open-window', (c) => {
      this.windows.panelWindow?.show()
      this.windows.panelWindow?.focus()
      return c.json({
        status: 'ok',
      })
    })

    const api = this.app.basePath('/api')

    api.route('bookmark', bookmarkRouter)

    // Drizzle Proxy endpoint
    api.post('/query', async (c) => {
      try {
        const { sql, params, method } = await c.req.json()

        // Prevent multiple queries
        const sqlBody = sql.replace(/;/g, '')

        console.log(
          '>>>>>>>>sqlBody:',
          sqlBody,
          'params:',
          params,
          'method:',
          method,
        )
        if (method === 'get') {
          const result = await pg.query(sql, params)
          return c.json({ rows: Object.values(result.rows[0] || {}) })
        } else {
          const result = await pg.query(sql, params)
          return c.json({
            rows: result.rows.map((row) => Object.values(row as any)),
          })
        }

        // Execute the query using the database client
        // const result = await client.execute(sqlBody)

        // console.log('========result:', result)

        // // Return the appropriate format based on method
        // if (method === 'get') {
        //   return c.json({ rows: result[0] || [] })
        // } else {
        //   return c.json({ rows: result.rows })
        // }
      } catch (error: any) {
        console.error('Database query error:', error)
        return c.json({ error: error.message }, 500)
      }
    })

    api.get('/users', async (c) => {
      return c.json({
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ],
      })
    })

    api.post('/users', async (c) => {
      const body = await c.req.json()
      return c.json(
        {
          message: 'User created successfully',
          user: body,
        },
        201,
      )
    })

    api.get('/files', async (c) => {
      const { dataDir } = this.config
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true })
      }
      return c.json({
        message: 'Files endpoint',
        dataDir,
      })
    })

    api.get('/system', (c) => {
      return c.json({
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        electronVersion: process.versions.electron,
        memory: process.memoryUsage(),
      })
    })

    this.app.notFound((c) => {
      return c.json(
        {
          error: 'Not found',
          path: c.req.path,
          method: c.req.method,
        },
        404,
      )
    })
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = serve(
          {
            fetch: this.app.fetch,
            port: this.config.port,
            hostname: this.config.host,
          },
          (info) => {
            console.log(
              `🚀 Hono server running at http://${info.address}:${info.port}`,
            )
            resolve()
          },
        ) as Server

        this.setupGracefulShutdown()
      } catch (error) {
        reject(error)
      }
    })
  }

  private setupGracefulShutdown() {
    const shutdown = async () => {
      if (this.server) {
        console.log('Shutting down Hono server...')
        this.server.close(() => {
          console.log('Hono server closed')
        })
      }
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
    electronApp.on('before-quit', shutdown)
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          this.server = null
          resolve()
        })
      })
    }
  }

  getApp() {
    return this.app
  }
}
