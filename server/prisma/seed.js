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

    // 설정 값 초기화
    await prisma.config.createMany({
        data: [
            { key: 'sweepWalletAddress', value: 'TRON_MAIN_WALLET_ADDRESS' },
            { key: 'gasLimit', value: '100000' },
        ],
        skipDuplicates: true,
    });

    console.log('✅ 관리자 및 기본 설정 데이터 삽입 완료');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
