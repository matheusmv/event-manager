import { Errors } from '../helpers/errors.js';
import { Password } from '../helpers/password.js';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userDetails) {
        // TODO: validate user details
        const { email, password } = userDetails;

        const alreadyExists = await this.userRepository.findUserByEmail(email, {
            id: true,
        });

        if (alreadyExists) {
            throw Errors.badRequest('invalid email or password');
        }

        const passwordHash = await Password.hash(password);

        return this.userRepository.saveUser(
            {
                email,
                password: passwordHash,
            },
            {
                id: true,
                email: true,
            },
        );
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
