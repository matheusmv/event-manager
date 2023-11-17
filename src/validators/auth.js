import { z } from 'zod';

const credentialsValidator = z.object({
    email: z
        .string({
            required_error: 'email is required',
            invalid_type_error: 'email must be a string',
        })
        .email({ message: 'invalid email address' }),
    password: z.string({
        required_error: 'password is required',
        invalid_type_error: 'password must be a string',
    }),
});

export async function validateCredentials(credentials) {
    return credentialsValidator.safeParseAsync(credentials).then((result) => {
        if (!result.success) {
            const prettyIssues = result.error.issues.map((issue) => {
                return {
                    issue: `invalid ${
                        issue.path[result.error.issues.length - 1]
                    }`,
                    error: issue.message,
                };
            });

            return { success: result.success, error: prettyIssues };
        }

        return result;
    });
}
