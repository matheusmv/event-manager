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

    async updateEvent(
        eventId,
        { name, date, description, local, category, manager },
    ) {
        const categoryUpdate = category && { connect: { name: category } };
        const managerUpdate = manager && { connect: { id: manager } };
        const localUpdate = local
            ? {
                  cep: local.cep,
                  state: local.state,
                  city: local.city,
                  neighborhood: local.neighborhood,
                  street: local.street,
                  number: local.number,
                  complement: local.complement,
              }
            : undefined;

        return this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                name,
                date,
                description,
                category: categoryUpdate,
                manager: managerUpdate,
                local: {
                    update: { localUpdate },
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

    const categoryFilter = category
        ?.split(',')
        .map((c) => c.trim())
        .filter((c) => c !== '');

    return {
        name: { contains: eventName, mode: 'insensitive' },
        date: buildDateFilter(),
        category: {
            name: {
                in: categoryFilter,
            },
        },
        local: {
            cep,
            state,
            city,
            neighborhood,
            street,
        },
    };
}

function buildOrderByClauseFromFilters(filters) {
    const order = filters.order || 'asc';

    const getOrderByQuery = (field, order) => {
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

    return getOrderByQuery(filters.orderBy, order);
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
