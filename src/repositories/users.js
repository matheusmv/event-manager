export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveUser(data) {
        return this.prisma.user.create({
            data: data,
        });
    }

    async findUserById(userId, select = undefined) {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: select,
        });
    }

    async findAllUsers(select = undefined) {
        return this.prisma.user.findMany({
            select: select,
        });
    }

    async updateUser(userId, userDetails) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: userDetails.email,
                password: userDetails.password,
                role: userDetails.role,
            },
        });
    }

    async deleteUser(userId) {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
