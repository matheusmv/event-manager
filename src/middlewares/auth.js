import { Errors } from '../helpers/errors.js';

export function ensureAuthentication(authService) {
    return async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization) {
            const error = Errors.unauthorized(
                'feature requires user authentication',
            );
            error.path = req.path;
            return res.status(error.status).json(error);
        }

        const [, token] = authorization.split(' ');

        return authService
            .getUser(token)
            .then((user) => {
                req.user = { id: user.id, role: user.role };
                next();
            })
            .catch((err) => next(err));
    };
}

export function ensureAuthorization(roles = []) {
    return async (req, res, next) => {
        const clientDetails = req.user;

        if (!clientDetails || !roles.includes(clientDetails.role)) {
            const error = Errors.forbidden(
                'feature requires user authorization',
            );
            error.path = req.path;
            return res.status(error.status).json(error);
        }

        next();
    };
}
