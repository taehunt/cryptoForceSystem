import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash('testwebhook', 10);
    console.log('hashed : ' + hashed);

    // 관리자 계정
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: hashed,
            role: 'superadmin',
        },
    });

    // 테스트 상점
    await prisma.merchant.create({
        data: {
            name: '테스트상점',
            walletPrivateKey: '0x123abc...',
            walletAddress: '0x456def...',
            tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        },
    });

    // Config 키 삽입 (Mongo에서는 createMany skipDuplicates 미지원)
    const configData = [
        { key: 'sweepWalletAddress', value: 'TRON_MAIN_WALLET_ADDRESS' },
        { key: 'gasLimit', value: '100000' },
    ];

    for (const item of configData) {
        const existing = await prisma.config.findUnique({ where: { key: item.key } });
        if (!existing) {
            await prisma.config.create({ data: item });
        }
    }

    console.log('✅ 관리자 및 기본 설정 데이터 삽입 완료');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
