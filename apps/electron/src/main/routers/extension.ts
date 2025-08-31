import { Conf } from 'electron-conf/main'
import { Hono } from 'hono'
import { streamSSE, streamText } from 'hono/streaming'
import { z } from 'zod'
import { CHROME_INFO } from '@penx/constants'

const app = new Hono()

app.get('/check', (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(Date.now()),
      })
      await stream.sleep(1000)
    }
  })
})

app.get('/getChromeInfo', (c) => {
  const conf = new Conf()
  return c.json({
    success: true,
    data: conf.get(CHROME_INFO),
  })
})

export default app
