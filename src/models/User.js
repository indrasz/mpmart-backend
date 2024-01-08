import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(data) {
    return prisma.user.create({ data });
}

async function findUserByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

export { createUser, findUserByUsername };