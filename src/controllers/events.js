import { HttpCreated, HttpNoContent, HttpOk } from '../helpers/http.js';

export function getAllEvents(eventService) {
    return async (req, res, next) => {
        return eventService
            .getAll()
            .then((event) => HttpOk(res, event))
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
        const eventDetails = req.body;

        return eventService
            .create(eventDetails)
            .then((event) => HttpCreated(res, event))
            .catch((err) => next(err));
    };
}

export function updateEvent(eventService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const eventDetails = req.body;

        return eventService
            .update(id, eventDetails)
            .then((event) => HttpOk(res, event))
            .catch((err) => next(err));
    };
}

export function deleteEvent(eventService) {
    return async (req, res, next) => {
        const { id } = req.params;

        return eventService
            .delete(id)
            .then(() => HttpNoContent(res))
            .catch((err) => next(err));
    };
}
