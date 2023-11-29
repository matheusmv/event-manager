import { PrismaClient } from '@prisma/client';

import { Password } from '../../helpers/password.js';
import { config } from '../../env.js';

const prisma = new PrismaClient();

async function main() {
    await prisma.user
        .create({
            data: {
                email: config.admin.email,
                password: await Password.hash(config.admin.password),
                role: 'ADMIN',
            },
        })
        .then(() => {
            console.log(
                `admin created: \n\temail: ${config.admin.email}\n\tpassword: ${config.admin.password}`,
            );
        });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    });
