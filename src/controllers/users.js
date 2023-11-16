export function getAllUsers(userService) {
    return async (req, res) => {
        return res.status(200).json({ users: [] });
    };
}

export function getUserById(userService) {
    return async (req, res) => {
        const { id } = req.params;

        return res.status(200).json({ id });
    };
}

export function createUser(userService) {
    return async (req, res) => {
        const userDetails = req.body;

        return res.status(201).json(userDetails);
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
