import { Errors } from '../helpers/errors.js';

export class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async create(name) {
        const category = await this.categoryRepository.findCategoryByName(name);

        if (category) {
            throw Errors.badRequest(
                `category with name '${name}' already exists`,
            );
        }

        return this.categoryRepository.saveCategory({
            name,
        });
    }

    async getById(categoryId) {
        return this.categoryRepository
            .findCategoryById(categoryId)
            .then((category) => {
                if (!category) {
                    throw Errors.notFound(
                        `category with id ${categoryId} does not exists`,
                    );
                }

                return category;
            });
    }

    async getAll() {
        return this.categoryRepository.findAllCategories({
            id: true,
            name: true,
        });
    }

    async update(categoryId, name) {
        const category =
            await this.categoryRepository.findCategoryById(categoryId);

        if (!category) {
            throw Errors.notFound(
                `category with id ${categoryId} does not exists`,
            );
        }

        return this.categoryRepository.updateCategory(categoryId, {
            name,
        });
    }

    async delete(categoryId) {
        const category =
            await this.categoryRepository.findCategoryById(categoryId);

        if (!category) {
            throw Errors.notFound(
                `category with id ${categoryId} does not exists`,
            );
        }

        return this.categoryRepository.deteleCategory(categoryId);
    }
}
