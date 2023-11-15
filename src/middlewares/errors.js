import { Errors, StandardError } from '../helpers/errors.js';
import { HttpInternalError } from '../helpers/http.js';

export function globalErrorHandler() {
    return async (error, req, res, next) => {
        if (error instanceof StandardError) {
            error.path = req.path;
            return res.status(error.status).json(error);
        }

        console.error(error);

        return HttpInternalError(res, Errors.internal('Unexpected error'));
    };
}
