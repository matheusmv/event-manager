import { HttpCreated, HttpOk } from '../helpers/http.js';

export function getAllEvents(eventService) {
    return async (req, res) => {
        // const events = await eventService.getAll();

        return res.status(200).json({ events: [] });
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
    return async (req, res) => {
        const { id } = req.params;

        // const event = await eventService.delete(id);

        return res.status(204).json();
    };
}
