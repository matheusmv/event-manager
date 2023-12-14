import { HttpCreated, HttpNoContent, HttpOk } from '../helpers/http.js';

export function getAllEvents(eventService) {
    return async (req, res, next) => {
        const filters = req.query;

        return eventService
            .getAll(filters)
            .then((events) => HttpOk(res, events))
            .catch((err) => next(err));
    };
}

export function getEventsPage(eventService) {
    return async (req, res, next) => {
        const { size, page, ...filters } = req.query;

        return eventService
            .getPage(size, page, filters)
            .then((events) => HttpOk(res, events))
            .catch((err) => next(err));
    };
}

export function getEventById(eventService) {
    return async (req, res, next) => {
        const { id } = req.params;

        return eventService
            .getById(id)
            .then((event) => HttpOk(res, event))
            .catch((err) => next(err));
    };
}

export function createEvent(eventService) {
    return async (req, res, next) => {
        const eventManager = req.user;
        const eventDetails = req.body;

        return eventService
            .create(eventManager, eventDetails)
            .then((event) => HttpCreated(res, event))
            .catch((err) => next(err));
    };
}

export function updateEvent(eventService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const eventManager = req.user;
        const eventDetails = req.body;

        return eventService
            .update(id, eventManager, eventDetails)
            .then((event) => HttpOk(res, event))
            .catch((err) => next(err));
    };
}

export function deleteEvent(eventService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const eventManager = req.user;

        return eventService
            .delete(id, eventManager)
            .then(() => HttpNoContent(res))
            .catch((err) => next(err));
    };
}
