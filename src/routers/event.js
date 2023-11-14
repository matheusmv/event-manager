import prismaClient from '../db/index.js';

import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../controllers/events.js';
import { EventService } from '../services/events.js';

export function buildEventRoute(router) {
    const endPoint = '/api/v1/events';

    const eventService = new EventService(prismaClient);

    // TODO: List all events
    router.get(endPoint, getAllEvents(eventService));

    // TODO: Get by id
    router.get(`${endPoint}/:id`, getEventById(eventService));

    // TODO: Create event
    router.post(endPoint, createEvent(eventService));

    // TODO: Update event
    router.put(`${endPoint}/:id`, updateEvent(eventService));

    // TODO: Delete event
    router.delete(`${endPoint}/:id`, deleteEvent(eventService));
}
