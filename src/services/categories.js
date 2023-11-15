import { Errors } from '../helpers/errors.js';

export class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(name) {
        const category = await this.prisma.category.findFirst({
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
        return this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    }

    async update(categoryId, name) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            throw Errors.notFound(
                `category with id ${categoryId} does not exists`,
            );
        }

        return this.prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
            },
        });
    }

    async detele(categoyIdId) {
        throw new Error('not implemented');
    }
}
