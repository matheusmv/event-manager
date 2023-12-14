export class LocationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async saveLocation(data) {
        return this.prisma.local.create({
            data: data,
        });
    }

    async findLocationById(id, select = undefined) {
        return this.prisma.local.findFirst({
            where: {
                id,
            },
            select: select,
        });
    }

    async findLocationByCep(locationCep, select = undefined) {
        return this.prisma.local.findFirst({
            where: {
                cep: locationCep,
            },
            select: select,
        });
    }

    async findAllLocations(select = undefined) {
        return this.prisma.local.findMany({
            select: select,
        });
    }

    async updateLocation(locationId, data) {
        return this.prisma.local.update({
            where: {
                id: locationId,
            },
            data: data,
        });
    }

    async deteleLocation(locationId) {
        return this.prisma.local.delete({
            where: {
                id: locationId,
            },
        });
    }
}
