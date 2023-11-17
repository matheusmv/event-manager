export function prettifyZodError(zodError) {
    return zodError.issues.map((issue) => {
        return {
            issue: issue.code,
            error: issue.message,
        };
    });
}
