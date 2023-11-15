import { Errors } from '../helpers/errors.js';
import { AsyncValidator } from '../helpers/validator.js';

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
        const validator = AsyncValidator.of(eventDetails)
            .validateAsync(async (eventDetails, issues) => {
                const categoryEntity =
                    await this.categoryRepository.findCategoryByName(
                        eventDetails.category,
                        {
                            id: true,
                        },
                    );

                if (categoryEntity == null) {
                    issues.push({
                        issue: 'category not found',
                        error: `category with name ${eventDetails.category} does not exists`,
                    });
                }

                return categoryEntity !== null;
            })
            .validateAsync(async (eventDetails, issues) => {
                const otherEvent =
                    await this.eventRepository.findEventByDateAndLocation(
                        eventDetails.date,
                        eventDetails.local,
                        {
                            id: true,
                        },
                    );

                if (otherEvent !== null) {
                    issues.push({
                        issue: 'conflict between events',
                        error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
                    });
                }

                return otherEvent === null;
            });

        return validator.executeAsync();
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
        const { eventName, category, cep, state, city, neighborhood, street } =
            filters;

        let date = undefined;

        if (filters.startDate) {
            date = {
                gte: new Date(filters.startDate),
                lte: filters.endDate ? new Date(filters.endDate) : undefined,
            };
        } else if (filters.date) {
            date = new Date(filters.date);
        }

        const where = {
            name: eventName,
            date: date,
            category: {
                name: category,
            },
            local: {
                cep: cep,
                state: state,
                city: city,
                neighborhood: neighborhood,
                street: street,
            },
        };

        return this.eventRepository.findAllEvents(where, {
            id: true,
            name: true,
            description: true,
            date: true,
        });
    }

    async update(eventId, eventDetails) {
        const event = this.eventRepository.findEventById(eventId, {
            id: true,
        });

        if (!event) {
            throw Errors.notFound(`event with id ${eventId} does not exists`);
        }

        // TODO: validate event fields

        eventDetails.id = eventId;
        eventDetails.date = eventDetails.date
            ? new Date(eventDetails.date)
            : event.date;

        const { success, issues } =
            await this.validateEventUpdate(eventDetails);
        if (!success) {
            throw Errors.validation('unable to update event', issues);
        }

        return this.eventRepository.updateEvent(eventId, eventDetails);
    }

    async validateEventUpdate(eventDetails) {
        const validator = AsyncValidator.of(eventDetails)
            .validateAsync(async (eventDetails, issues) => {
                const categoryEntity =
                    await this.categoryRepository.findCategoryByName(
                        eventDetails.category,
                        {
                            id: true,
                        },
                    );

                if (categoryEntity == null) {
                    issues.push({
                        issue: 'category not found',
                        error: `category with name ${eventDetails.category} does not exists`,
                    });
                }

                return categoryEntity !== null;
            })
            .validateAsync(async (eventDetails, issues) => {
                const otherEvent =
                    await this.eventRepository.findEventByDateAndLocation(
                        eventDetails.date,
                        eventDetails.local,
                        {
                            id: true,
                        },
                    );

                if (otherEvent !== null && otherEvent.id !== eventDetails.id) {
                    issues.push({
                        issue: 'conflict between events',
                        error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
                    });
                }

                return otherEvent === null;
            });

        return validator.executeAsync();
    }

    async delete(eventId) {
        const event = await this.eventRepository.findEventById(eventId, {
            id: true,
        });

        if (!event) {
            throw Errors.notFound(`event with id ${eventId} does not exists`);
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
