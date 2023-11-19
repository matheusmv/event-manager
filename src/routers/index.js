import { Router } from 'express';
import { buildEventRoute } from './event.js';
import { buildCategoryRoute } from './category.js';
import { buildUserRoute } from './user.js';
import { buildAuthenticationRoute } from './auth.js';

export function getRouters() {
    const router = new Router();

    buildEventRoute(router);
    buildCategoryRoute(router);
    buildUserRoute(router);
    buildAuthenticationRoute(router);

    return router;
}
