export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userDetails) {
        throw new Error('not implemented');
    }

    async getById(userId) {
        throw new Error('not implemented');
    }

    async getAll() {
        throw new Error('not implemented');
    }

    async update(userId, userDetails) {
        throw new Error('not implemented');
    }

    async delete(userId) {
        throw new Error('not implemented');
    }
}
