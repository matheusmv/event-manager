import { z } from 'zod';
import { prettifyZodError } from '../helpers/zod.js';

const emailValidator = z
    .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
    })
    .email({ message: 'invalid email address' });

const passwordValidator = z
    .string({
        required_error: 'password is required',
        invalid_type_error: 'password must be a string',
    })
    .trim()
    .min(5, { message: 'password must be 5 or more characters long' });

const userAccountCreationValidator = z.object({
    email: emailValidator,
    password: passwordValidator,
});

export async function validateUserAccountCreationInfo(userDetails) {
    return userAccountCreationValidator
        .safeParseAsync(userDetails)
        .then((result) => {
            if (!result.success) {
                return {
                    success: result.success,
                    error: prettifyZodError(result.error),
                };
            }

            return result;
        });
}

const userRoleValidator = z.enum(['ADMIN', 'MANAGER', 'USER']);

export async function validateUserRole(role) {
    return userRoleValidator.safeParseAsync(role).then((result) => {
        if (!result.success) {
            return {
                success: result.success,
                error: prettifyZodError(result.error),
            };
        }

        return result;
    });
}
