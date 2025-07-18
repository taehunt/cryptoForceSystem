import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash('testwebhook', 10); // 기본 비밀번호

    // 관리자 계정 생성
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: hashed,
            role: 'superadmin',
        },
    });

    // MongoDB는 skipDuplicates 지원 안함 → createMany 대신 create 개별 호출
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
