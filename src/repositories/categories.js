export class CategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveCategory(data) {
        return this.prisma.category.create({
            data: data,
        });
    }

    async findCategoryById(id, select = undefined) {
        return this.prisma.category.findFirst({
            where: {
                id,
            },
            select: select,
        });
    }

    async findCategoryByName(name, select = undefined) {
        return this.prisma.category.findFirst({
            where: {
                name,
            },
            select: select,
        });
    }

    async findAllCategories(select = undefined) {
        return this.prisma.category.findMany({
            select: select,
        });
    }

    async updateCategory(id, { name }) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data: { name },
        });
    }

    async deteleCategory(id) {
        return this.prisma.category.delete({
            where: {
                id,
            },
        });
    }
}
