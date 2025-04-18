import { PrismaClient } from '@penx/db/client'
import { pagination } from 'prisma-extension-pagination'

export * from '@penx/db/client'

const client = new PrismaClient()
const extendedPrisma = client.$extends(pagination())

const globalForPrisma = globalThis as { prisma?: typeof extendedPrisma }

export const prisma = globalForPrisma.prisma || extendedPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
