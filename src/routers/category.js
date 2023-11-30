import prismaClient from '../db/index.js';

import { UserRepository } from '../repositories/users.js';

import { AuthenticationService } from '../services/auth.js';

import {
    ensureAuthentication,
    ensureAuthorization,
} from '../middlewares/auth.js';

import { role } from '../helpers/auth.js';

import { CategoryRepository } from '../repositories/categories.js';

import { CategoryService } from '../services/categories.js';

import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
} from '../controllers/categories.js';

export function buildCategoryRoute(router) {
    const endPoint = '/api/v1/categories';

    const userRepository = new UserRepository(prismaClient);
    const authService = new AuthenticationService(userRepository);

    const categoryRepository = new CategoryRepository(prismaClient);
    const categoryService = new CategoryService(categoryRepository);

    router.get(endPoint, getAllCategories(categoryService));
    router.get(`${endPoint}/:id`, getCategoryById(categoryService));
    router.post(
        endPoint,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        createCategory(categoryService),
    );
    router.put(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        updateCategory(categoryService),
    );
    router.delete(
        `${endPoint}/:id`,
        ensureAuthentication(authService),
        ensureAuthorization([role.ADMIN, role.MANAGER]),
        deleteCategory(categoryService),
    );
}
