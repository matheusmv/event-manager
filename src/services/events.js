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
        return this.eventRepository.updateEvent(eventId, eventDetails);
    }

    async delete(eventId) {
        await this.eventRepository.deteleEvent(eventId);
    }
}
