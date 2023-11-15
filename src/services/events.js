import { Errors } from '../helpers/errors.js';

async function findCategoryByName(prisma, categoryName) {
    return prisma.category.findFirst({
        where: {
            name: categoryName,
        },
        select: {
            id: true,
            name: true,
        },
    });
}

async function findLocationByCep(prisma, cep) {
    return prisma.local.findFirst({
        where: {
            cep,
        },
        select: {
            id: true,
            cep: true,
            state: true,
            city: true,
            neighborhood: true,
            street: true,
            number: true,
            Event: true,
        },
    });
}

function locationEquals(locationA, locationB) {
    return (
        locationA.state === locationB.state &&
        locationA.city === locationB.city &&
        locationA.neighborhood === locationB.neighborhood &&
        locationA.street === locationB.street &&
        locationA.number === locationB.number
    );
}

function eventDateEquals(dateA, dateB) {
    return dateA.toISOString() === dateB.toISOString();
}

async function validateEventCreation(prisma, eventDetails) {
    let success = true;
    const issues = [];

    const categoryEntity = await findCategoryByName(
        prisma,
        eventDetails.category,
    );
    if (!categoryEntity) {
        success = false;
        issues.push({
            issue: 'category not found',
            error: `category with name ${eventDetails.category} does not exists`,
        });
    }

    const locationEntity = await findLocationByCep(prisma, eventDetails.cep);
    if (
        locationEntity &&
        locationEquals(eventDetails.local, locationEntity) &&
        eventDateEquals(eventDetails.date, locationEntity.Event.date)
    ) {
        success = false;
        issues.push({
            issue: 'conflict between events',
            error: `there is already an event (id: ${locationEntity.Event.id}) registered on the same date for that location`,
        });
    }

    return { success, issues };
}

export class EventService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(eventDetails) {
        eventDetails.date = new Date(eventDetails.date);

        const { success, issues } = await validateEventCreation(
            this.prisma,
            eventDetails,
        );
        if (!success) {
            throw Errors.validation('unable to register new event', issues);
        }

        const {
            name,
            date,
            description,
            category,
            local: {
                cep,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
            },
        } = eventDetails;

        return this.prisma.event.create({
            data: {
                name,
                date,
                description,
                category: {
                    connect: { name: category },
                },
                local: {
                    create: {
                        cep,
                        state,
                        city,
                        neighborhood,
                        street,
                        number,
                        complement,
                    },
                },
            },
        });
    }

    async getById(eventId) {
        throw new Error('not implemented');
    }

    async getAll() {
        throw new Error('not implemented');
    }

    async update(eventId, eventDetails) {
        throw new Error('not implemented');
    }

    async detele(eventId) {
        throw new Error('not implemented');
    }
}
