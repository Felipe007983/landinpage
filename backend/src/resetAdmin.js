const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@zeusevolution.com.br';
    const password = 'admin123';
    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
        where: { email },
        data: { password_hash }
    });

    console.log(`Password reset for ${user.email} (new password: ${password})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
