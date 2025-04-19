import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createContext } from '@penx/api'
import cors from './cors'

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createContext as any, // TODO:handle any
  })
  return cors(req, response)
}

export const maxDuration = 120

export { handler as GET, handler as POST }

// import { appRouter } from '@penx/api'
// import { createContext } from '@/server/context'
// import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
// import cors from 'cors'

// const handler = async (req: Request) => {
//   // Create a response object to set CORS headers
//   const res = new Response()

//   // Use the cors middleware to handle CORS settings
//   await new Promise((resolve, reject) => {
//     cors({
//       origin: '*', // Change this to your specific allowed origin
//       methods: ['GET', 'POST', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization'],
//       credentials: true, // Set this if you need to send cookies or authentication headers
//     })(req as any, res as any, (result) => {
//       if (result instanceof Error) {
//         reject(result)
//       } else {
//         resolve(result)
//       }
//     })
//   })

//   // Now call the fetchRequestHandler with the modified response
//   return fetchRequestHandler({
//     endpoint: '/api/trpc',
//     req,
//     router: appRouter,
//     createContext,
//   })
// }

// export const maxDuration = 60 * 2

// export { handler as GET, handler as POST }
