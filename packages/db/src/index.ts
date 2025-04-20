import { PrismaClient } from '@prisma/client'
import { pagination } from 'prisma-extension-pagination'

const client = new PrismaClient()
const extendedPrisma = client.$extends(pagination())

const globalForPrisma = globalThis as { prisma?: typeof extendedPrisma }

export const prisma = globalForPrisma.prisma || extendedPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
