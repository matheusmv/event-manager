import jwt from 'jsonwebtoken';

import { Errors } from '../helpers/errors.js';

const secret = process.env.TOKEN_SECRET;
const expiration = process.env.TOKEN_EXPIRATION;

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
