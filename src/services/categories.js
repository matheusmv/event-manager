export class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(name) {
        throw new Error('not implemented');
    }

    async getById(categoyId) {
        throw new Error('not implemented');
    }

    async getAll() {
        throw new Error('not implemented');
    }

    async update(categoyId, name) {
        throw new Error('not implemented');
    }

    async detele(categoyIdId) {
        throw new Error('not implemented');
    }
}
