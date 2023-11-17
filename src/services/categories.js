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
        return this.categoryRepository.updateCategory(categoryId, {
            name,
        });
    }

    async delete(categoryId) {
        await this.categoryRepository.deteleCategory(categoryId);
    }
}
