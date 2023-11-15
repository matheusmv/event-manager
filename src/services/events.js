export class EventService {
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }

    async create(eventDetails) {
        throw new Error('not implemented');
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

    async delete(eventId) {
        throw new Error('not implemented');
    }
}
