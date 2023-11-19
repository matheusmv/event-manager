import { HttpCreated, HttpNoContent, HttpOk } from '../helpers/http.js';

export function getAllCategories(categoryService) {
    return async (req, res, next) => {
        return categoryService
            .getAll()
            .then((categories) => HttpOk(res, categories))
            .catch((err) => next(err));
    };
}

export function getCategoryById(categoryService) {
    return async (req, res, next) => {
        const { id } = req.params;

        return categoryService
            .getById(id)
            .then((category) => HttpOk(res, category))
            .catch((err) => next(err));
    };
}

export function createCategory(categoryService) {
    return async (req, res, next) => {
        const { name } = req.body;

        return categoryService
            .create(name)
            .then((category) => HttpCreated(res, category))
            .catch((err) => next(err));
    };
}

export function updateCategory(categoryService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;

        return categoryService
            .update(id, name)
            .then((category) => HttpOk(res, category))
            .catch((err) => next(err));
    };
}

export function deleteCategory(categoryService) {
    return async (req, res, next) => {
        const { id } = req.params;

        return categoryService
            .delete(id)
            .then(() => HttpNoContent(res))
            .catch((err) => next(err));
    };
}
