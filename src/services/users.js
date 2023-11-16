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
        return this.userRepository
            .findUserById(userId, { id: true, email: true, role: true })
            .then((user) => {
                if (!user) {
                    throw Errors.notFound(
                        `user with id ${userId} does not exists`,
                    );
                }

                return user;
            });
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
