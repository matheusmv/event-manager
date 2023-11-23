import jwt from 'jsonwebtoken';

import { Errors } from '../helpers/errors.js';
import { config } from '../env.js';

const secret = config.security.jwt.secret;
const expiration = config.security.jwt.expiration;

export class JWT {
    static generate(payload) {
        return jwt.sign(payload, secret, { expiresIn: expiration });
    }

    static verify(token) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw Errors.unauthorized(err.message);
            }

            return null;
        }
    }
}
