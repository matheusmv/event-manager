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

    async findAllEvents(
        where = undefined,
        orderBy = undefined,
        select = undefined,
    ) {
        return this.prisma.event.findMany({
            where: where,
            orderBy: orderBy,
            select: select,
        });
    }

    async updateEvent(eventId, eventDetails) {
        const { name, date, description, local } = eventDetails;

        const category = eventDetails.category
            ? { connect: { name: eventDetails.category } }
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
