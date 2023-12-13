import { role } from '../helpers/auth.js';
import { Errors } from '../helpers/errors.js';
import {
    validateEventCreation,
    validateEventUpdate,
} from '../validators/event.js';
import { validateEventSearchFilters } from '../validators/searchFilters.js';

export const DEFAULT_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;

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
        const validation = await validateEventSearchFilters(filters);
        if (!validation.success) {
            throw Errors.validation(
                'invalid filter query params',
                validation.error,
            );
        }

        return this.eventRepository.findAllEvents(validation.data, {
            id: true,
            name: true,
            description: true,
            date: true,
            category: true,
        });
    }

    async getPage(size = DEFAULT_PAGE_SIZE, page = FIRST_PAGE, filters) {
        const validation = await validateEventSearchFilters(filters);
        if (!validation.success) {
            throw Errors.validation(
                'invalid filter query params',
                validation.error,
            );
        }

        return this.eventRepository.findAllEventsPaginated(
            validation.data,
            {
                id: true,
                name: true,
                description: true,
                date: true,
                category: true,
                local: {
                    select: {
                        id: true,
                        city: true,
                        state: true,
                    },
                },
            },
            { size, page },
        );
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
        event.manager.id === eventManager.id || eventManager.role === role.ADMIN
    );
}
