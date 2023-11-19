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

    async findUserById(userId, select = undefined) {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: select,
        });
    }

    async findUserByEmail(userEmail, select = undefined) {
        return this.prisma.user.findFirst({
            where: {
                email: userEmail,
            },
            select: select,
        });
    }

    async findAllUsers(select = undefined) {
        return this.prisma.user.findMany({
            select: select,
        });
    }

    async updateUser(userId, userDetails, select = undefined) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: userDetails.email,
                password: userDetails.password,
                role: userDetails.role,
            },
            select: select,
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
