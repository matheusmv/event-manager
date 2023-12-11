import { PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { Password } from '../../helpers/password.js';
import { config } from '../../env.js';
import { role } from '../../helpers/auth.js';

const prisma = new PrismaClient();

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

        await prisma.local.deleteMany();
        await prisma.event.deleteMany();
        await prisma.category.deleteMany();

        await prisma.category
            .createMany({
                data: categories,
                skipDuplicates: true,
            })
            .then((r) => console.log(r));

        await prisma.event
            .createMany({
                data: events,
                skipDuplicates: true,
            })
            .then((r) => console.log(r));

        await prisma.local
            .createMany({
                data: adresses,
                skipDuplicates: true,
            })
            .then((r) => console.log(r));
    }
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
