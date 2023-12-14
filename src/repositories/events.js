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

    async saveEventWithCategoryAndLocation({
        name,
        date,
        description,
        category,
        manager,
        local,
    }) {
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
                    create: local,
                },
            },
        });
    }

    async findEventById(id, select = undefined) {
        return this.prisma.event.findFirst({
            where: {
                id,
            },
            select: select,
        });
    }

    async findEventByDate(date, select = undefined) {
        return this.prisma.event.findFirst({
            where: {
                date,
            },
            select: select,
        });
    }

    async findEventByDateAndLocation(
        date,
        { cep, state, city, neighborhood, street, number },
        select = undefined,
    ) {
        return this.prisma.event.findFirst({
            where: {
                date,
                local: {
                    cep,
                    state,
                    city,
                    neighborhood,
                    street,
                    number,
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

    async updateEvent(
        id,
        { name, date, description, local, category, manager },
    ) {
        const categoryUpdate = category && { connect: { name: category } };
        const managerUpdate = manager && { connect: { id: manager } };
        const localUpdate = local && {
            udpate: {
                cep: local.cep,
                state: local.state,
                city: local.city,
                neighborhood: local.neighborhood,
                street: local.street,
                number: local.number,
                complement: local.complement,
            },
        };

        return this.prisma.event.update({
            where: {
                id,
            },
            data: {
                name,
                date,
                description,
                category: categoryUpdate,
                manager: managerUpdate,
                local: localUpdate,
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

function buildWhereClauseFromFilters({
    eventName,
    date,
    startDate,
    endDate,
    category,
    cep,
    state,
    city,
    neighborhood,
    street,
}) {
    const buildDateFilter = () => {
        if (startDate) {
            return { gte: startDate, lte: endDate };
        }

        if (endDate) {
            return { gte: today(), lte: endDate };
        }

        return date;
    };

    const nameFilter = eventName && {
        contains: eventName,
        mode: 'insensitive',
    };

    const categoryFilter = category && {
        name: {
            in: category
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c !== ''),
        },
    };

    return {
        name: nameFilter,
        date: buildDateFilter(),
        category: categoryFilter,
        local: {
            cep,
            state,
            city,
            neighborhood,
            street,
        },
    };
}

function buildOrderByClauseFromFilters({ orderBy, order }) {
    const getOrderByClause = (field, order = 'asc') => {
        if (!field) {
            return { date: order };
        }

        switch (field) {
            case 'category':
                return { category: { name: order } };
            case 'local':
                return { local: { city: order } };
            default:
                return { [field]: order };
        }
    };

    return getOrderByClause(orderBy, order);
}

function buildOffsetPagination(size, page) {
    size = parseInt(size) || DEFAULT_PAGE_SIZE;
    page = parseInt(page) || FIRST_PAGE;

    const skip = Math.max((page - 1) * size, 0);

    return {
        skip,
        take: size,
    };
}
