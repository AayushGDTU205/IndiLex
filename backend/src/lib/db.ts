import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

//prisma setup for postgres
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

globalForPrisma.prisma = prisma