import prismaClient from '../db/index.js';

import { UserRepository } from '../repositories/users.js';

import { AuthenticationService } from '../services/auth.js';

import {
    ensureAuthentication,
    ensureAuthorization,
} from '../middlewares/auth.js';

import { role } from '../helpers/auth.js';

import { UserService } from '../services/users.js';

import {
    changeUserPrivileges,
    createUser,
    deleteUser,
    getAllUsers,
    getAuthenticatedUser,
    getUserById,
    updateUser,
} from '../controllers/users.js';

export function buildUserRoute(router) {
    const endPoint = '/api/v1/users';

    const userRepository = new UserRepository(prismaClient);
    const authService = new AuthenticationService(userRepository);
    const userService = new UserService(userRepository);

    router.get(
        endPoint,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN]),
        getAllUsers(userService),
    );
    router.get(
        `${endPoint}/me`,
        ensureAuthentication(authService),
        getAuthenticatedUser(userService),
    );
    router.get(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        getUserById(userService),
    );
    router.post(endPoint, createUser(userService));
    router.put(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        updateUser(userService),
    );
    router.delete(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        deleteUser(userService),
    );
    router.put(
        `${endPoint}/:id/role`,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN]),
        changeUserPrivileges(userService),
    );
}
