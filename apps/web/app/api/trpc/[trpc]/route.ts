import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createContext } from '@penx/api'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createContext as any, // TODO:handle any
  })
  return response
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers,
  })
}

export async function GET(req: Request) {
  const res = await handler(req)
  res.headers.set('Access-Control-Allow-Origin', '*')
  return res
}

export async function POST(req: Request) {
  const res = await handler(req)
  res.headers.set('Access-Control-Allow-Origin', '*')
  return res
}
