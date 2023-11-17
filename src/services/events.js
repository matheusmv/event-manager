import { Errors } from '../helpers/errors.js';
import {
    validateEventCreation,
    validateEventUpdate,
} from '../validators/event.js';

export class EventService {
    constructor(eventRepository, categoryRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
    }

    async create(eventManager, eventDetails) {
        const validation = await validateEventCreation(
            eventDetails,
            this.categoryRepository,
            this.eventRepository,
        );
        if (!validation.success) {
            throw Errors.validation(
                'unable to register new event',
                validation.error,
            );
        }

        validation.data.manager = eventManager.id;

        return this.eventRepository.saveEventWithCategoryAndLocation(
            validation.data,
        );
    }

    async getById(eventId) {
        return this.eventRepository
            .findEventById(
                eventId,
                selectEventWithCategoryNameAndLocationDetails(),
            )
            .then((event) => {
                if (!event) {
                    throw Errors.notFound(
                        `event with id ${eventId} does not exists`,
                    );
                }

                return event;
            });
    }

    async getAll(filters) {
        return this.eventRepository.findAllEvents(filters, {
            id: true,
            name: true,
            description: true,
            date: true,
        });
    }

    async update(eventId, eventManager, eventDetails) {
        const event = await this.eventRepository.findEventById(eventId, {
            id: true,
            manager: true,
        });

        if (!event) {
            throw Errors.notFound(`event with id ${eventId} does not exists`);
        }

        if (!isResourceOwnerOrAdmin(event, eventManager)) {
            throw Errors.badRequest('cannot modify resource');
        }

        const validation = await validateEventUpdate(
            eventId,
            eventDetails,
            this.categoryRepository,
            this.eventRepository,
        );
        if (!validation.success) {
            throw Errors.validation('unable to update event', validation.error);
        }

        return this.eventRepository.updateEvent(eventId, validation.data);
    }

    async delete(eventId, eventManager) {
        const event = await this.eventRepository.findEventById(eventId, {
            id: true,
            manager: true,
        });

        if (!event) {
            throw Errors.notFound(`event with id ${eventId} does not exists`);
        }

        if (!isResourceOwnerOrAdmin(event, eventManager)) {
            throw Errors.badRequest('cannot modify resource');
        }

        await this.eventRepository.deteleEvent(eventId);
    }
}

function selectEventWithCategoryNameAndLocationDetails() {
    return {
        id: true,
        name: true,
        description: true,
        date: true,
        category: {
            select: {
                name: true,
            },
        },
        local: {
            select: {
                cep: true,
                state: true,
                city: true,
                neighborhood: true,
                street: true,
                number: true,
                complement: true,
            },
        },
    };
}

function isResourceOwnerOrAdmin(event, eventManager) {
    return (
        event.manager.id === eventManager.id || eventManager.role === 'ADMIN'
    );
}
