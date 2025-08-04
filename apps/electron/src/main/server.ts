import { existsSync, mkdirSync } from 'fs'
import { Server } from 'http'
import { serve } from '@hono/node-server'
import { app as electronApp } from 'electron'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { db, pg } from '@penx/db/client'
import aiRouter from './routers/ai'
import bookmarkRouter from './routers/bookmark'
import nodeRouter from './routers/node'
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

    api.route('/bookmark', bookmarkRouter)
    api.route('/node', nodeRouter)
    api.route('/ai', aiRouter)

    // Drizzle Proxy endpoint
    api.post('/query', async (c) => {
      try {
        const { sql, params, method } = await c.req.json()

        // Prevent multiple queries
        const sqlBody = sql.replace(/;/g, '')

        // console.log(
        //   '>>>>>>>>sqlBody:',
        //   sqlBody,
        //   'params:',
        //   params,
        //   'method:',
        //   method,
        // )

        const result = await pg.query(sql, params, {
          rowMode: method === 'all' ? 'array' : undefined,
        })

        // console.log('======result:', result)

        // Return raw data from database, let client handle date processing
        // return c.json({ rows: result.rows })
        return c.json(result)
      } catch (error: any) {
        console.error('Database query error:', error)
        return c.json({ error: error.message }, 500)
      }
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
