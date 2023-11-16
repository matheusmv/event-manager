import { HttpCreated, HttpOk } from '../helpers/http.js';

export function getAllUsers(userService) {
    return async (req, res) => {
        return res.status(200).json({ users: [] });
    };
}

export function getUserById(userService) {
    return async (req, res, next) => {
        const { id } = req.params;

        return userService
            .getById(id)
            .then((user) => HttpOk(res, user))
            .catch((err) => next(err));
    };
}

export function createUser(userService) {
    return async (req, res, next) => {
        const userDetails = req.body;

        return userService
            .create(userDetails)
            .then((user) => HttpCreated(res, user))
            .catch((err) => next(err));
    };
}

export function updateUser(userService) {
    return async (req, res) => {
        const { id } = req.params;
        const userDetails = req.body;

        return res.status(200).json({ id, ...userDetails });
    };
}

export function deleteUser(userService) {
    return async (req, res) => {
        const { id } = req.params;

        return res.status(204).json();
    };
}
