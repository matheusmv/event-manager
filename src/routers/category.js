import prismaClient from '../db/index.js';

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

    const categoryService = new CategoryService(prismaClient);

    // TODO: List all categories
    router.get(endPoint, getAllCategories(categoryService));

    // TODO: Get by id
    router.get(`${endPoint}/:id`, getCategoryById(categoryService));

    // TODO: Create category
    router.post(endPoint, createCategory(categoryService));

    // TODO: Update category
    router.put(`${endPoint}/:id`, updateCategory(categoryService));

    // TODO: Delete category
    router.delete(`${endPoint}/:id`, deleteCategory(categoryService));
}
