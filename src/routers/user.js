import prismaClient from '../db/index.js';

import { UserRepository } from '../repositories/users.js';

import { UserService } from '../services/users.js';

import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from '../controllers/users.js';

export function buildUserRoute(router) {
    const endPoint = '/api/v1/users';

    const eventRepository = new UserRepository(prismaClient);
    const eventService = new UserService(eventRepository);

    router.get(endPoint, getAllUsers(eventService));
    router.get(`${endPoint}/:id`, getUserById(eventService));
    router.post(endPoint, createUser(eventService));
    router.put(`${endPoint}/:id`, updateUser(eventService));
    router.delete(`${endPoint}/:id`, deleteUser(eventService));
}
