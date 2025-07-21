import prisma from '../lib/prismaClient.js';

export const getMerchants = async () => {
    return await prisma.merchant.findMany({
        select: {
            id: true,
            name: true,
            category: true,
            walletAddress: true
        }
    });
};
