import { existsSync, mkdirSync } from 'fs'
import { Server } from 'http'
import { serve } from '@hono/node-server'
import { createNodeWebSocket, NodeWebSocket } from '@hono/node-ws'
import { app as electronApp } from 'electron'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { WSContext } from 'hono/ws'
import aiRouter from './routers/ai'
import bookmarkRouter from './routers/bookmark'
import dbProxyRouter from './routers/db-proxy'
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

  private ws: NodeWebSocket
  private wsConnections: Set<WSContext<WebSocket>> = new Set()

  constructor(
    private config: ServerConfig,
    private windows: Windows,
  ) {
    this.app = new Hono()

    this.ws = createNodeWebSocket({
      app: this.app,
    })

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

  private broadcast(message: string) {
    console.log(`Broadcasting to ${this.wsConnections.size} clients:`, message)
    this.wsConnections.forEach((ws) => {
      try {
        if (ws.readyState === 1) {
          // WebSocket.OPEN
          ws.send(message)
        } else {
          console.log('delete ws.......')

          this.wsConnections.delete(ws)
        }
      } catch (error) {
        console.error('Error broadcasting message:', error)
        this.wsConnections.delete(ws)
      }
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

    this.app.get('/open-window-after-subscription', (c) => {
      this.windows.panelWindow?.show()
      this.windows.panelWindow?.focus()
      this.windows.panelWindow?.webContents.send(
        'open-window-after-subscription',
      )
      return c.json({
        status: 'ok',
      })
    })

    this.app.get(
      '/ws',
      this.ws.upgradeWebSocket((c) => {
        const server = this
        return {
          // https://hono.dev/helpers/websocket
          onOpen(evt, ws) {
            console.log('New WebSocket connection established', ws)
            server.wsConnections.add(ws)
          },
          onMessage: (evt, ws) => {
            console.log('>>>>>>>>>>>>>Received message from client:', evt.data)

            server.broadcast(`size: ${server.wsConnections.size}`)

            if (typeof evt.data === 'string') {
              try {
                const data = JSON.parse(evt.data)
                if (data.type === 'translate-input') {
                  console.log('====data:', data.payload)
                  server.broadcast(evt.data)
                }

                if (data.type === 'translate-output') {
                  console.log('====data:', data.payload)
                  server.broadcast(evt.data)
                }
              } catch (error) {
                //
              }
            }
          },
          onClose(evt, ws) {
            console.log('WebSocket connection closed:', evt.code, evt.reason)
            server.wsConnections.delete(ws)
          },
          onError(err, ws) {
            console.error('WebSocket error:', err)
            server.wsConnections.delete(ws)
          },
        }
      }),
    )

    const api = this.app.basePath('/api')

    api.route('/bookmark', bookmarkRouter)
    api.route('/node', nodeRouter)
    api.route('/ai', aiRouter)

    // Drizzle Proxy endpoint
    api.route('/db', dbProxyRouter)

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

        this.ws.injectWebSocket(this.server)

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
