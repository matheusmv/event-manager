import { Errors } from '../helpers/errors.js';
import { Password } from '../helpers/password.js';
import { JWT } from '../helpers/jwt.js';

export class AuthenticationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async authenticate(credentials) {
        // TODO: validate credentials
        const { email, password } = credentials;

        const user = await this.userRepository.findUserByEmail(email, {
            id: true,
            password: true,
        });

        if (!user) {
            throw Errors.unauthorized('invalid email or password');
        }

        const passwordMatch = await Password.compare(password, user.password);
        if (!passwordMatch) {
            throw Errors.unauthorized('invalid email or password');
        }

        const jwtToken = JWT.generate({ id: user.id });

        return { accessToken: jwtToken };
    }
}
