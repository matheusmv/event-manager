export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveUser(data, select = undefined) {
        return this.prisma.user.create({
            data: data,
            select: select,
        });
    }

    async findUserById(id, select = undefined) {
        return this.prisma.user.findFirst({
            where: {
                id,
            },
            select: select,
        });
    }

    async findUserByEmail(email, select = undefined) {
        return this.prisma.user.findFirst({
            where: {
                email,
            },
            select: select,
        });
    }

    async findAllUsers(select = undefined) {
        return this.prisma.user.findMany({
            select: select,
        });
    }

    async updateUser(id, { email, password, role }, select = undefined) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                password,
                role,
            },
            select: select,
        });
    }

    async deleteUser(id) {
        return this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
