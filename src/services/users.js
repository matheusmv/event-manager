import { Errors } from '../helpers/errors.js';
import { Password } from '../helpers/password.js';
import { validateUserAccountCreationInfo } from '../validators/user.js';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(userDetails) {
        const validation = await validateUserAccountCreationInfo(userDetails);
        if (!validation.success) {
            throw Errors.validation('invalid account info', validation.error);
        }

        const { email, password } = validation.data;

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

    async getById(userId, eventManager) {
        return this.userRepository
            .findUserById(userId, { id: true, email: true, role: true })
            .then((user) => {
                if (!user) {
                    throw Errors.notFound(
                        `user with id ${userId} does not exists`,
                    );
                }

                if (!isAccountOwnerOrAdmin(user, eventManager)) {
                    throw Errors.badRequest('Unable to retrieve resource');
                }

                return user;
            });
    }

    async getAll() {
        return this.userRepository.findAllUsers({
            id: true,
            email: true,
            role: true,
        });
    }

    async update(userId, eventManager, userDetails) {
        throw new Error('not implemented');
    }

    async delete(userId, eventManager) {
        throw new Error('not implemented');
    }
}

function isAccountOwnerOrAdmin(user, eventManager) {
    return user.id === eventManager.id || eventManager.role === 'ADMIN';
}
