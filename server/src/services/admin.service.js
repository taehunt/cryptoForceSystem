import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function findPendingDeposits() {
    return prisma.transaction.findMany({
        where: { type: 'deposit', status: 'pending' },
        orderBy: { createdAt: 'desc' },
    });
}

export function confirmDepositById(id) {
    return prisma.transaction.update({
        where: { id },
        data: { status: 'confirmed' },
    });
}
