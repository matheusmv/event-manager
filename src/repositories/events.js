export class EventRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveEvent(data) {
        return this.prisma.event.create({
            data: data,
        });
    }

    async saveEventWithCategoryAndLocation(eventDetails) {
        const {
            name,
            date,
            description,
            category,
            manager,
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
                manager: {
                    connect: { id: manager },
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

    async findEventById(eventId, select = undefined) {
        return this.prisma.event.findFirst({
            where: {
                id: eventId,
            },
            select: select,
        });
    }

    async findEventByDate(eventDate, select = undefined) {
        return this.prisma.event.findFirst({
            where: {
                date: eventDate,
            },
            select: select,
        });
    }

    async findEventByDateAndLocation(
        eventDate,
        eventLocation,
        select = undefined,
    ) {
        return this.prisma.event.findFirst({
            where: {
                date: eventDate,
                local: {
                    cep: eventLocation.cep,
                    state: eventLocation.state,
                    city: eventLocation.city,
                    neighborhood: eventLocation.neighborhood,
                    street: eventLocation.street,
                    number: eventLocation.number,
                },
            },
            select: select,
        });
    }

    async findAllEvents(filters, select = undefined) {
        const whereClause = buildWhereClauseFromFilters(filters);
        const orderByClause = buildOrderByClauseFromFilters(filters);

        return this.prisma.event.findMany({
            where: whereClause,
            orderBy: orderByClause,
            select: select,
        });
    }

    async updateEvent(eventId, eventDetails) {
        const { name, date, description, local } = eventDetails;

        const category = eventDetails.category
            ? { connect: { name: eventDetails.category } }
            : undefined;

        const manager = eventDetails.manager
            ? { connect: { id: eventDetails.manager } }
            : undefined;

        return this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                name,
                date,
                description,
                category,
                manager,
                local: {
                    update: {
                        cep: local ? local.cep : undefined,
                        state: local ? local.state : undefined,
                        city: local ? local.city : undefined,
                        neighborhood: local ? local.neighborhood : undefined,
                        street: local ? local.street : undefined,
                        number: local ? local.number : undefined,
                        complement: local ? local.complement : undefined,
                    },
                },
            },
        });
    }

    async deteleEvent(eventId) {
        return this.prisma.event.delete({
            where: {
                id: eventId,
            },
        });
    }
}

function buildWhereClauseFromFilters(filters) {
    let date = undefined;

    if (filters.startDate) {
        date = {
            gte: new Date(filters.startDate),
            lte: filters.endDate ? new Date(filters.endDate) : undefined,
        };
    } else if (filters.endDate) {
        date = {
            gte: filters.startDate ? new Date(filters.startDate) : new Date(),
            lte: new Date(filters.endDate),
        };
    } else if (filters.date) {
        date = new Date(filters.date);
    }

    const { eventName, category, cep, state, city, neighborhood, street } =
        filters;

    return {
        name: eventName,
        date: date,
        category: {
            name: category,
        },
        local: {
            cep: cep,
            state: state,
            city: city,
            neighborhood: neighborhood,
            street: street,
        },
    };
}

function buildOrderByClauseFromFilters(filters) {
    let orderBy = undefined;

    if (filters.orderBy) {
        orderBy = {
            [filters.orderBy]: filters.order ? filters.order : 'asc',
        };
    } else {
        orderBy = {
            id: filters.order ? filters.order : 'asc',
        };
    }

    return orderBy;
}
