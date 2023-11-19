export class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async create(name) {
        return await this.categoryRepository.saveCategory({ name });
    }

    async getById(categoryId) {
        throw new Error('not implemented');
    }

    async getAll() {
        return await this.categoryRepository.findAllCategories();
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
