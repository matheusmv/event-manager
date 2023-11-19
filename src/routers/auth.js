import prismaClient from '../db/index.js';

import { UserRepository } from '../repositories/users.js';

import { AuthenticationService } from '../services/auth.js';

import { authenticateUser } from '../controllers/auth.js';

export function buildAuthenticationRoute(router) {
    const endPoint = '/login';

    const userRepository = new UserRepository(prismaClient);
    const authenticationService = new AuthenticationService(userRepository);

    router.post(endPoint, authenticateUser(authenticationService));
}
