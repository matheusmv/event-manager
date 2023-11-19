import { z } from 'zod';
import { eventCategoryValidator, eventNameValidator } from './event.js';
import {
    cepValidator,
    cityValidator,
    neighborhoodValidator,
    stateValidator,
} from './location.js';
import { prettifyZodError } from '../helpers/zod.js';

const dateValidator = z
    .string({
        required_error: 'event date is required',
        invalid_type_error: 'event date must be a string',
    })
    .trim()
    .regex(/\d{4}-\d{2}-\d{2}/, {
        message: 'event date must be in the format yyyy-mm-dd',
    })
    .transform((value, ctx) => {
        try {
            return new Date(value);
        } catch (err) {
            ctx.addIssue({
                code: z.ZodDate,
                message: 'event date must be in the format yyyy-mm-dd',
            });

            return z.NEVER;
        }
    });

const orderByValidator = z
    .string({
        invalid_type_error: 'orderBy must be a string',
    })
    .trim()
    .min(1, { message: 'orderBy must be 1 or more characters long' });

const orderValidator = z
    .string({
        invalid_type_error: 'order must be a string',
    })
    .superRefine((value, ctx) => {
        if (!['asc', 'desc'].includes(value)) {
            ctx.addIssue({
                code: 'invalid_arguments',
                message: `'order' query param expected 'asc' | 'desc', received '${value}'`,
            });

            return value;
        }
    });

const searchFiltersValidator = z
    .object({
        eventName: eventNameValidator.optional(),
        date: dateValidator.optional(),
        startDate: dateValidator.optional(),
        endDate: dateValidator.optional(),
        category: eventCategoryValidator.optional(),
        cep: cepValidator.optional(),
        state: stateValidator.optional(),
        city: cityValidator.optional(),
        neighborhood: neighborhoodValidator.optional(),
        street: stateValidator.optional(),
        orderBy: orderByValidator.optional(),
        order: orderValidator.optional(),
    })
    .optional();

export async function validateEventSearchFilters(filters) {
    return searchFiltersValidator.safeParseAsync(filters).then((result) => {
        if (!result.success) {
            return {
                success: result.success,
                error: prettifyZodError(result.error),
            };
        }

        return result;
    });
}
