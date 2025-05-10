import { NextRequest } from 'next/server'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// login
export async function POST(req: NextRequest) {
  return Response.json({ foo: 'bar' }, { headers })
}

export async function GET() {
  return Response.json({ hello: 'world' }, { headers })
}
