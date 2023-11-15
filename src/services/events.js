import { Errors } from '../helpers/errors.js';

export class EventService {
    constructor(eventRepository, categoryRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
    }

    async create(eventDetails) {
        // TODO: validate event fields
        eventDetails.date = new Date(eventDetails.date);

        const { success, issues } =
            await this.validateEventCreation(eventDetails);
        if (!success) {
            throw Errors.validation('unable to register new event', issues);
        }

        return this.eventRepository.saveEventWithCategoryAndLocation(
            eventDetails,
        );
    }

    async validateEventCreation(eventDetails) {
        let success = true;
        const issues = [];

        const categoryEntity = await this.categoryRepository.findCategoryByName(
            eventDetails.category,
            {
                id: true,
                name: true,
            },
        );

        if (!categoryEntity) {
            success = false;
            issues.push({
                issue: 'category not found',
                error: `category with name ${eventDetails.category} does not exists`,
            });
        }

        const otherEvent =
            await this.eventRepository.findEventByDateAndLocation(
                eventDetails.date,
                eventDetails.local,
                {
                    id: true,
                },
            );

        if (otherEvent) {
            success = false;
            issues.push({
                issue: 'conflict between events',
                error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
            });
        }

        return { success, issues };
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
