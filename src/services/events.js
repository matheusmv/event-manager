export class EventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async create(eventDetails) {
        try {
            eventDetails = await prisma.event.create({
                data: {
                    name: eventData.name,
                    date: eventData.date,
                    description: eventData.description,
                    category: eventData.category,
                    local: eventData.local,
                },
            });
        } catch (error) {
            throw new Error('An error occurred');
        }
    }

    async getById(eventId) {
        throw new Error('not implemented');
    }

    async getAll() {
        return await prisma.event.findMany();
    }

    async update(eventId, eventDetails) {
        throw new Error('not implemented');
    }

    async delete(eventId) {
        throw new Error('not implemented');
    }
}
