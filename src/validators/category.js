import { z } from 'zod';
import { prettifyZodError } from '../helpers/zod.js';

const categoryNameValidator = z
    .string({
        required_error: 'category name is required',
        invalid_type_error: 'category name must be a string',
    })
    .trim()
    .toLowerCase()
    .min(1, { message: 'category name must be 1 or more characters long' });

export async function validateCategoryName(categoryName) {
    return categoryNameValidator.safeParseAsync(categoryName).then((result) => {
        if (!result.success) {
            return {
                success: result.success,
                error: prettifyZodError(result.error),
            };
        }

        return result;
    });
}
