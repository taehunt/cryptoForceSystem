import prisma from '../lib/prismaClient.js';

export const createPaymentRequest = async ({ userId, merchantId, amount, tokenType }) => {
    return await prisma.paymentRequest.create({
        data: {
            userId,
            merchantId,
            amount,
            tokenType,
            status: 'PENDING',
        },
    });
};
