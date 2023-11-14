import { Router } from 'express';
import { buildEventRoute } from './event.js';
import { buildCategoryRoute } from './category.js';

export function getRouters() {
    const router = new Router();

    buildEventRoute(router);
    buildCategoryRoute(router);

    return router;
}
