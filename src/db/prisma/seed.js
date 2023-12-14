import { PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { Password } from '../../helpers/password.js';
import { config } from '../../env.js';
import { role } from '../../helpers/auth.js';

const prisma = new PrismaClient();

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    });

async function main() {
    const admin = await prisma.user.upsert({
        where: {
            email: config.admin.email,
        },
        update: {},
        create: {
            email: config.admin.email,
            password: await Password.hash(config.admin.password),
            role: role.ADMIN,
        },
    });

    console.log(
        `admin created: \n\temail: ${admin.email}\n\tpassword: ${config.admin.password}`,
    );

    if (config.env === 'development') {
        const { categories, events, adresses } = setupSeed(admin.id);

        resetAndSeed(prisma.category, categories);
        resetAndSeed(prisma.event, events);
        resetAndSeed(prisma.local, adresses);
    }
}

function setupSeed(managerId, total = 50) {
    const categories = [
        { id: faker.string.uuid(), name: 'música' },
        { id: faker.string.uuid(), name: 'cinema' },
        { id: faker.string.uuid(), name: 'concertos' },
        { id: faker.string.uuid(), name: 'conferências' },
        { id: faker.string.uuid(), name: 'esportes' },
        { id: faker.string.uuid(), name: 'festivais' },
        { id: faker.string.uuid(), name: 'outros' },
    ];

    const events = Array.from({ length: total }, () => {
        return {
            id: faker.string.uuid(),
            name: faker.word.words(),
            date: faker.date.future().toISOString(),
            description: faker.word.words({ count: 255 }),
            categoryId: faker.helpers.arrayElement(categories).id,
            userId: managerId,
        };
    });

    const adresses = events.reduce((adresses, event) => {
        adresses.push({
            cep: faker.location.zipCode('########'),
            state: faker.location.state({ abbreviated: true }),
            city: faker.location.city(),
            neighborhood: faker.location.street(),
            street: faker.location.street(),
            number: faker.location.buildingNumber(),
            complement: faker.location.secondaryAddress(),
            eventId: event.id,
        });

        return adresses;
    }, []);

    return { categories, events, adresses };
}

async function resetAndSeed(prismaModel, values) {
    await prismaModel?.deleteMany();
    await prismaModel
        ?.createMany({
            data: values,
            skipDuplicates: true,
        })
        .then((r) => console.log(r));
}
