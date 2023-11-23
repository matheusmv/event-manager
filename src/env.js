import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

function getPrismaLogger() {
    if (env === 'development') {
        return ['error', 'info', 'query', 'warn'];
    }

    return ['error'];
}

const config = {
    env: env,
    port: process.env.PORT || 3000,
    db: {
        prisma: {
            log: getPrismaLogger(),
        },
    },
    security: {
        jwt: {
            secret: process.env.TOKEN_SECRET,
            expiration: process.env.TOKEN_EXPIRATION,
        },
    },
};

export { config };
