import { ContentfulStatusCode } from 'hono/utils/http-status'

export class BusinessError extends Error {
  code: string
  status: ContentfulStatusCode = 400

  constructor(code: string, message: string) {
    super(message)

    this.name = 'BusinessError'
    this.code = code
  }
}
