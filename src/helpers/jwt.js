import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET;

export class JWT {
    static generate(payload) {
        return jwt.sign(payload, secret, { expiresIn: '24h' });
    }
}
