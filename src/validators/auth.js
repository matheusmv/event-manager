import { z } from 'zod';
import { prettifyZodError } from '../helpers/zod.js';

const emailValidator = z
    .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
    })
    .email({ message: 'invalid email address' });

const passwordValidator = z.string({
    required_error: 'password is required',
    invalid_type_error: 'password must be a string',
});

const credentialsValidator = z.object({
    email: emailValidator,
    password: passwordValidator,
});

export async function validateCredentials(credentials) {
    return credentialsValidator.safeParseAsync(credentials).then((result) => {
        if (!result.success) {
            return {
                success: result.success,
                error: prettifyZodError(result.error),
            };
        }

        return result;
    });
}
