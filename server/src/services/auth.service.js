import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function checkAdminLogin(inputPassword) {
    const admin = await prisma.admin.findFirst();

    if (!admin) {
        console.log('❌ admin not found in DB');
        return false;
    }

    //console.log('🧪 입력된 비밀번호:', inputPassword);
    //console.log('🔐 DB의 해시값:', admin.passwordHash);

    const isMatch = await bcrypt.compare(inputPassword, admin.passwordHash);
    //console.log('✅ bcrypt.compare 결과:', isMatch);

    return isMatch;
}
