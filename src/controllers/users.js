import { HttpCreated, HttpNotImplemented, HttpOk } from '../helpers/http.js';

export function getAllUsers(userService) {
    return async (req, res, next) => {
        return userService
            .getAll()
            .then((users) => HttpOk(res, users))
            .catch((err) => next(err));
    };
}

export function getAuthenticatedUser(userService) {
    return async (req, res, next) => {
        const user = req.user;

        return userService
            .getById(user.id, user)
            .then((user) => HttpOk(res, user))
            .catch((err) => next(err));
    };
}

export function getUserById(userService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const eventManager = req.user;

        return userService
            .getById(id, eventManager)
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
        const eventManager = req.user;
        const userDetails = req.body;

        return HttpNotImplemented(res);
    };
}

export function deleteUser(userService) {
    return async (req, res) => {
        const { id } = req.params;
        const eventManager = req.user;

        return HttpNotImplemented(res);
    };
}

export function changeUserPrivileges(userService) {
    return async (req, res, next) => {
        const { id } = req.params;
        const { role } = req.body;

        return userService
            .setUserRole(id, role)
            .then((user) => HttpOk(res, user))
            .catch((err) => next(err));
    };
}
