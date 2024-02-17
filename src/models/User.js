import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data) => {
    return prisma.user.create({ data });
}

export const findUserById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
}

export const updateUserById = async (id, data) => {
    return prisma.user.update({ where: { id }, data });
}

export const findUserByUsername = async (username) => {
    return prisma.user.findUnique({ where: { username } });
}

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
}

export const findUserByNim = async (nim) => {
    return prisma.user.findUnique({ where: { nim } });
}