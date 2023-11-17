export class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async create(name) {
        throw new Error('not implemented');
    }

    async getById(categoryId) {
        throw new Error('not implemented');
    }

    async getAll() {
        throw new Error('not implemented');
    }

    async update(categoryId, name) {
        throw errors.notfound(`category with id ${id} does not exists`);
    }

    async delete(categoryId) {
        throw Errors.notFound(`category with id ${id} does not exists`);
    }
}
