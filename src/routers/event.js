import prismaClient from '../db/index.js';

import { EventRepository } from '../repositories/events.js';

import { EventService } from '../services/events.js';

import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    updateEvent,
} from '../controllers/events.js';

export function buildEventRoute(router) {
    const endPoint = '/api/v1/events';

    const eventRepository = new EventRepository(prismaClient);
    const eventService = new EventService(eventRepository);

    router.get(endPoint, getAllEvents(eventService));
    router.get(`${endPoint}/:id`, getEventById(eventService));
    router.post(endPoint, createEvent(eventService));
    router.put(`${endPoint}/:id`, updateEvent(eventService));
    router.delete(`${endPoint}/:id`, deleteEvent(eventService));
}
