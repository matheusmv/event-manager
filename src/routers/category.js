import prismaClient from '../db/index.js';

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

    const categoryRepository = new CategoryRepository(prismaClient);
    const categoryService = new CategoryService(categoryRepository);

    router.get(endPoint, getAllCategories(categoryService));
    router.get(`${endPoint}/:id`, getCategoryById(categoryService));
    router.post(endPoint, createCategory(categoryService));
    router.put(`${endPoint}/:id`, updateCategory(categoryService));
    router.delete(`${endPoint}/:id`, deleteCategory(categoryService));
}
