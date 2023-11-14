export function getAllEvents(eventService) {
    return async (req, res) => {
        // const events = await eventService.getAll();

        return res.status(200).json({ events: [] });
    };
}

export function getEventById(eventService) {
    return async (req, res) => {
        const { id } = req.params;

        // const event = await eventService.getById(id);

        return res.status(200).json({ id });
    };
}

export function createEvent(eventService) {
    return async (req, res) => {
        const eventDetails = req.body;

        // const event = await eventService.create(eventDetails);

        return res.status(200).json(eventDetails);
    };
}

export function updateEvent(eventService) {
    return async (req, res) => {
        const { id } = req.params;
        const eventDetails = req.body;

        // const event = await eventService.update(id, eventDetails);

        return res.status(200).json({ id, ...eventDetails });
    };
}

export function deleteEvent(eventService) {
    return async (req, res) => {
        const { id } = req.params;

        // const event = await eventService.delete(id);

        return res.status(204).json();
    };
}
