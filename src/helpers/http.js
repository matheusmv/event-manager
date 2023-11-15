export function HttpOk(res, body = undefined) {
    return res.status(200).json(body);
}

export function HttpCreated(res, body = undefined) {
    return res.status(201).json(body);
}

export function HttpNoContent(res, body = undefined) {
    return res.status(204).json(body);
}

export function HttpBadRequest(res, body = undefined) {
    return res.status(400).json(body);
}

export function HttpUnauthorized(res, body = undefined) {
    return res.status(401).json(body);
}

export function HttpForbidden(res, body = undefined) {
    return res.status(403).json(body);
}

export function HttpInternalError(res, body = undefined) {
    return res.status(500).json(body);
}

export function HttpNotImplemented(res, body = undefined) {
    return res.status(501).json(body);
}

export function HttpServiceUnavailable(res, body = undefined) {
    return res.status(503).json(body);
}
