import { Errors } from '../helpers/errors.js';
import { Password } from '../helpers/password.js';
import { JWT } from '../helpers/jwt.js';
import { validateCredentials } from '../validators/auth.js';
import { buildDTOWith } from '../helpers/dto.js';

export class AuthenticationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async authenticate(credentials) {
        const validation = await validateCredentials(credentials);
        if (!validation.success) {
            throw Errors.validation('invalid credentials', validation.error);
        }

        const { email, password } = validation.data;

        const user = await this.userRepository.findUserByEmail(email, {
            id: true,
            email: true,
            password: true,
            role: true,
        });

        if (!user) {
            throw Errors.unauthorized('invalid email or password');
        }

        const passwordMatch = await Password.compare(password, user.password);
        if (!passwordMatch) {
            throw Errors.unauthorized('invalid email or password');
        }

        const jwtToken = JWT.generate({ id: user.id });

        return {
            accessToken: jwtToken,
            user: buildDTOWith(user, ['id', 'email', 'role']),
        };
    }

    async getUser(token) {
        const payload = JWT.verify(token);

        if (!payload) {
            throw Errors.unauthorized('invalid token');
        }

        const user = await this.userRepository.findUserById(payload.id, {
            id: true,
            role: true,
        });

        if (!user) {
            throw Errors.unauthorized('invalid token');
        }

        return user;
    }
}
