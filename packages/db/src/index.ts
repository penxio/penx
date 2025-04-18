import { pagination } from 'prisma-extension-pagination'
import { PrismaClient } from '../generated/prisma/client'

const client = new PrismaClient()
const extendedPrisma = client.$extends(pagination())

const globalForPrisma = globalThis as { prisma?: typeof extendedPrisma }

export const prisma = globalForPrisma.prisma || extendedPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
