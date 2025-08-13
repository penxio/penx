type MessageData = string | ArrayBuffer | Blob | ArrayBufferView

interface WebSocketClientOptions {
  reconnectDelay?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  heartbeatMsg?: string
  onOpen?: (ev: Event) => void
  onClose?: (ev: CloseEvent) => void
  onError?: (ev: Event) => void
  onMessage?: (data: MessageData, ev: MessageEvent<MessageData>) => void
}

export class WebSocketClient {
  private url: string
  private reconnectDelay: number
  private maxReconnectAttempts: number
  private heartbeatIntervalTime: number
  private heartbeatMsg: string

  private ws: WebSocket | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private messageQueue: MessageData[] = []

  public onOpen: (ev: Event) => void = () => {}
  public onClose: (ev: CloseEvent) => void = () => {}
  public onError: (ev: Event) => void = () => {}
  public onMessage: (data: MessageData, ev: MessageEvent<MessageData>) => void =
    () => {}

  constructor(url: string, options: WebSocketClientOptions = {}) {
    this.url = url
    this.reconnectDelay = options.reconnectDelay ?? 5000
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity
    this.heartbeatIntervalTime = options.heartbeatInterval ?? 30000
    this.heartbeatMsg = options.heartbeatMsg ?? 'ping'

    if (options.onOpen) this.onOpen = options.onOpen
    if (options.onClose) this.onClose = options.onClose
    if (options.onError) this.onError = options.onError
    if (options.onMessage) this.onMessage = options.onMessage

    this.connect()
  }

  private connect(): void {
    console.log('=====>>>>>>>>>>>>111')
    console.log('=====WebSocket:', WebSocket)

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Maximum reconnection attempts reached, will not reconnect.')
      return
    }

    this.ws = new WebSocket(this.url)

    // Support binary data as ArrayBuffer
    this.ws.binaryType = 'arraybuffer'

    this.ws.onopen = (ev: Event) => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      this.onOpen(ev)
      this.flushQueue()
      this.startHeartbeat()
    }

    this.ws.onmessage = (ev: MessageEvent<MessageData>) => {
      if (ev.data === 'pong') {
        // Heartbeat pong response
        return
      }
      this.onMessage(ev.data, ev)
    }

    this.ws.onerror = (ev: Event) => {
      console.error('WebSocket error', ev)
      this.onError(ev)
    }

    this.ws.onclose = (ev: CloseEvent) => {
      console.log('WebSocket closed', ev.reason)
      this.onClose(ev)
      this.stopHeartbeat()
      this.scheduleReconnect()
    }
  }

  /**
   * Send message if connected; otherwise enqueue
   */
  public send(data: MessageData): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      console.warn('WebSocket not connected, message queued:', data)
      this.messageQueue.push(data)
    }
  }

  /**
   * Flush queued messages once connected
   */
  private flushQueue(): void {
    while (
      this.messageQueue.length > 0 &&
      this.ws &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      const data = this.messageQueue.shift()
      if (data !== undefined) {
        this.ws.send(data)
      }
    }
  }

  /**
   * Start heartbeat interval to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this.heartbeatMsg)
      }
    }, this.heartbeatIntervalTime)
  }

  /**
   * Stop heartbeat interval
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Schedule a reconnect attempt after delay
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return

    this.reconnectAttempts++
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      console.log(`Reconnection attempt #${this.reconnectAttempts}...`)
      this.connect()
    }, this.reconnectDelay)
  }

  /**
   * Close the WebSocket proactively
   */
  public close(code = 1000, reason = 'client close'): void {
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close(code, reason)
    }
  }
}
