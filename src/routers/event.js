import prismaClient from '../db/index.js';

import { UserRepository } from '../repositories/users.js';

import { AuthenticationService } from '../services/auth.js';

import {
    ensureAuthentication,
    ensureAuthorization,
} from '../middlewares/auth.js';

import { role } from '../helpers/auth.js';

import { EventRepository } from '../repositories/events.js';

import { CategoryRepository } from '../repositories/categories.js';

import { EventService } from '../services/events.js';

import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    getEventsPage,
    updateEvent,
} from '../controllers/events.js';

export function buildEventRoute(router) {
    const endPoint = '/api/v1/events';

    const userRepository = new UserRepository(prismaClient);
    const authService = new AuthenticationService(userRepository);

    const eventRepository = new EventRepository(prismaClient);
    const categoryRepository = new CategoryRepository(prismaClient);
    const eventService = new EventService(eventRepository, categoryRepository);

    router.get(endPoint, getAllEvents(eventService));
    router.get(`${endPoint}/page`, getEventsPage(eventService));
    router.get(`${endPoint}/:id`, getEventById(eventService));
    router.post(
        endPoint,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        createEvent(eventService),
    );
    router.put(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        updateEvent(eventService),
    );
    router.delete(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        deleteEvent(eventService),
    );
}
