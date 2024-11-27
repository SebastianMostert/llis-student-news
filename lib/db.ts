import { PrismaClient } from '@prisma/client';

declare global {
    var db: PrismaClient
}

// Create a single PrismaClient instance
export const db = global.db || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.db = db;
}
