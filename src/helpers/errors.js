export class StandardError extends Error {
    constructor(
        timestamp,
        status,
        error,
        message,
        path = undefined,
        issues = undefined,
    ) {
        super(message);
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.path = path;
        this.issues = issues;
    }

    static of(status, error, message, path = undefined, issues = undefined) {
        return new StandardError(
            Date.now(),
            status,
            error,
            message,
            path,
            issues,
        );
    }
}

export class Errors {
    static notFound(message) {
        return StandardError.of(404, 'Object Not Found', message);
    }

    static validation(message, issues) {
        return StandardError.of(
            422,
            'Unprocessable Entity',
            message,
            undefined,
            issues,
        );
    }

    static internal(message) {
        return StandardError.of(500, 'Internal Server Error', message);
    }
}
