import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export function createUser(email, passwordHash) {
    return prisma.user.create({
        data: { email, passwordHash }
    });
}

export function validatePassword(input, hash) {
    return bcrypt.compare(input, hash);
}
