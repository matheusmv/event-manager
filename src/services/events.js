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

        if (otherEvent !== null) {
            success = false;
            issues.push({
                issue: 'conflict between events',
                error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
            });
        }

        return { success, issues };
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

    async getAll() {
        throw new Error('not implemented');
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
        let success = true;
        const issues = [];

        if (eventDetails.category) {
            const categoryEntity =
                await this.categoryRepository.findCategoryByName(
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
        }

        if (eventDetails.local) {
            const otherEvent =
                await this.eventRepository.findEventByDateAndLocation(
                    eventDetails.date,
                    eventDetails.local,
                    {
                        id: true,
                    },
                );

            if (otherEvent !== null && otherEvent.id !== eventDetails.id) {
                success = false;
                issues.push({
                    issue: 'conflict between events',
                    error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
                });
            }
        }

        return { success, issues };
    }

    async detele(eventId) {
        throw new Error('not implemented');
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
