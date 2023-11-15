import { Errors } from '../helpers/errors.js';

export class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(name) {
        const category = await this.prisma.category.findUnique({
            where: {
                name,
            },
        });

        if (category) {
            throw Errors.badRequest(
                `category with name '${name}' already exists`,
            );
        }

        return this.prisma.category.create({
            data: {
                name,
            },
        });
    }

    async getById(categoryId) {
        return this.prisma.category
            .findFirst({
                where: {
                    id: categoryId,
                },
                select: {
                    id: true,
                    name: true,
                },
            })
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
        throw new Error('not implemented');
    }

    async update(categoyId, name) {
        throw new Error('not implemented');
    }

    async detele(categoyIdId) {
        throw new Error('not implemented');
    }
}
