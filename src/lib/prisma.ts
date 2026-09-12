import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma Client if DATABASE_URL exists
export const prisma = globalForPrisma.prisma ?? (
  process.env.DATABASE_URL 
    ? new PrismaClient()
    : undefined as any
)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}