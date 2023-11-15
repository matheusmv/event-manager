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
                    complement: eventLocation.complement,
                },
            },
            select: select,
        });
    }

    async findAllEvents(select = undefined) {
        return this.prisma.event.findMany({
            select: select,
        });
    }

    async updateEvent(eventId, data) {
        return this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: data,
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
