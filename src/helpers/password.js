import bcrypt from 'bcryptjs';

export class Password {
    static async hash(password) {
        return bcrypt.hash(password, 8);
    }

    static async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
