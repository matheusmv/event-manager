export class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
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
        throw new Error('not implemented');
    }

    async delete(categoryId) {
        throw new Error('not implemented');
    }
}
