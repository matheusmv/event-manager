export class CategoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveCategory(data) {
        return this.prisma.category.create({
            data: data,
        });
    }

    async findCategoryById(categoryId, select = undefined) {
        return this.prisma.category.findFirst({
            where: {
                id: categoryId,
            },
            select: select,
        });
    }

    async findCategoryByName(categoryName, select = undefined) {
        return this.prisma.category.findFirst({
            where: {
                name: categoryName,
            },
            select: select,
        });
    }

    async findAllCategories(select = undefined) {
        return this.prisma.category.findMany({
            select: select,
        });
    }

    async updateCategory(categoryId, data = undefined) {
        return this.prisma.category.update({
            where: {
                id: categoryId,
            },
            data: data,
        });
    }

    async deteleCategory(categoryId) {
        return this.prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    }
}
