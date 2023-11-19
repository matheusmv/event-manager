import { HttpOk } from '../helpers/http.js';

export function authenticateUser(authService) {
    return async (req, res, next) => {
        const credentials = req.body;

        return authService
            .authenticate(credentials)
            .then((authToken) => HttpOk(res, authToken))
            .catch((err) => next(err));
    };
}
