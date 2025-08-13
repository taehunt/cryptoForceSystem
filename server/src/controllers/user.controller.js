import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getMe(req, res) {
    try {
        const me = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, wallet: true, defaultWalletType: true }
        });
        if (!me) return res.status(404).json({ message: 'Not found' });
        res.json(me);
    } catch (e) {
        res.status(500).json({ message: 'me failed' });
    }
}

export async function updateWallet(req, res) {
    try {
        const { wallet, defaultWalletType } = req.body;
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: { wallet, defaultWalletType }
        });
        res.json({ ok: true, id: updated.id });
    } catch (e) {
        res.status(500).json({ message: 'update failed' });
    }
}
