import { today } from '../helpers/date.js';
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from '../services/events.js';

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

    async findAllEventsPaginated(filters, select = undefined, { size, page }) {
        const whereClause = buildWhereClauseFromFilters(filters);
        const orderByClause = buildOrderByClauseFromFilters(filters);
        const { skip, take } = buildOffsetPagination(size, page);

        const [events, total] = await this.prisma.$transaction([
            this.prisma.event.findMany({
                skip: skip,
                take: take,
                where: whereClause,
                orderBy: orderByClause,
                select: select,
            }),
            this.prisma.event.count({
                where: whereClause,
            }),
        ]);

        return {
            events,
            meta: {
                itemsPerPage: parseInt(size) || DEFAULT_PAGE_SIZE,
                totalItems: total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / size),
            },
        };
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
            gte: filters.startDate,
            lte: filters.endDate ? filters.endDate : undefined,
        };
    } else if (filters.endDate) {
        date = {
            gte: filters.startDate ? filters.startDate : today(),
            lte: filters.endDate,
        };
    } else if (filters.date) {
        date = filters.date;
    }

    const { eventName, category, cep, state, city, neighborhood, street } =
        filters;

    let categoryQuery = category
        ? category
              .split(',')
              .map((c) => c.trim())
              .filter((c) => c !== '')
        : undefined;

    return {
        name: { contains: eventName },
        date: date,
        category: {
            name: {
                in: categoryQuery,
            },
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
            date: filters.order ? filters.order : 'asc',
        };
    }

    return orderBy;
}

function buildOffsetPagination(size, page) {
    if (size !== undefined && typeof size !== 'number' && size !== '') {
        size = parseInt(size) || DEFAULT_PAGE_SIZE;
    }

    if (page !== undefined && typeof page !== 'number' && page !== '') {
        page = parseInt(page) || FIRST_PAGE;
    }

    size = size < 1 ? DEFAULT_PAGE_SIZE : size;
    page = page < 1 ? FIRST_PAGE : page;

    const skip = (page - 1) * size;

    return {
        skip,
        take: size,
    };
}
