import { PrismaClient } from '@prisma/client';
import { config } from '../env.js';

const prismaClient = new PrismaClient({
    log: config.db.prisma.log,
});

export default prismaClient;
