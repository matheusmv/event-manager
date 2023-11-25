import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

function getPrismaLogger() {
    if (env === 'development') {
        return ['error', 'info', 'query', 'warn'];
    }

    return ['error'];
}

function getMorganLogger() {
    if (env === 'development') {
        return 'dev';
    }

    return 'tiny';
}

const config = {
    env: env,
    port: process.env.PORT || 3000,
    admin: {
        email: process.env.DEFAULT_ADMIN_EMAIL || 'root@root.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'root',
    },
    logger: {
        morgan: getMorganLogger(),
    },
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
