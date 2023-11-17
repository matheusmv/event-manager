import { z } from 'zod';
import { locationValidator } from './location.js';
import { prettifyZodError } from '../helpers/zod.js';
import { today } from '../helpers/date.js';
import { AsyncValidator } from '../helpers/validator.js';

const eventNameValidator = z
    .string({
        required_error: 'event name is required',
        invalid_type_error: 'event name must be a string',
    })
    .trim()
    .min(1, { message: 'event name must be 1 or more characters long' });

const eventDateValidator = z
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
    })
    .pipe(
        z.date().min(today(), {
            message: 'invalid event date',
        }),
    );

const eventDescriptionValidator = z
    .string({
        required_error: 'event description is required',
        invalid_type_error: 'event description must be a string',
    })
    .trim()
    .min(1, { message: 'must provide a description of the event' });

const eventCategoryValidator = z
    .string({
        required_error: 'event category name is required',
        invalid_type_error: 'event category name must be a string',
    })
    .trim()
    .min(1, { message: 'event category must be 1 or more characters long' });

const eventDetailsValidator = z.object({
    name: eventNameValidator,
    date: eventDateValidator,
    description: eventDescriptionValidator,
    category: eventCategoryValidator,
    local: locationValidator,
});

export async function validateEventCreation(
    eventDetails,
    categoryRepository,
    eventRepository,
) {
    return eventDetailsValidator
        .safeParseAsync(eventDetails)
        .then((result) => {
            if (!result.success) {
                return {
                    success: result.success,
                    error: prettifyZodError(result.error),
                };
            }

            return result;
        })
        .then(async (eventDetailsValidatorResult) => {
            if (!eventDetailsValidatorResult.success)
                return eventDetailsValidatorResult;

            const validation = await validateEventCreationDBConflicts(
                eventDetailsValidatorResult.data,
                categoryRepository,
                eventRepository,
            );

            if (!validation.success) {
                return {
                    success: validation.success,
                    error: validation.issues,
                };
            }

            return eventDetailsValidatorResult;
        });
}

async function validateEventCreationDBConflicts(
    eventDetails,
    categoryRepository,
    eventRepository,
) {
    const validator = AsyncValidator.of(eventDetails)
        .validateAsync(async (eventDetails, issues) => {
            const categoryEntity = await categoryRepository.findCategoryByName(
                eventDetails.category,
                {
                    id: true,
                },
            );

            if (categoryEntity == null) {
                issues.push({
                    issue: 'category not found',
                    error: `category with name ${eventDetails.category} does not exists`,
                });
            }

            return categoryEntity !== null;
        })
        .validateAsync(async (eventDetails, issues) => {
            const otherEvent = await eventRepository.findEventByDateAndLocation(
                eventDetails.date,
                eventDetails.local,
                {
                    id: true,
                },
            );

            if (otherEvent !== null) {
                issues.push({
                    issue: 'conflict between events',
                    error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
                });
            }

            return otherEvent === null;
        });

    return validator.executeAsync();
}

const eventUpdateDetailsValidator = z.object({
    name: eventNameValidator.optional(),
    date: eventDateValidator.optional(),
    description: eventDescriptionValidator.optional(),
    category: eventCategoryValidator.optional(),
    local: locationValidator.optional(),
});

export async function validateEventUpdate(
    eventId,
    eventDetails,
    categoryRepository,
    eventRepository,
) {
    return eventUpdateDetailsValidator
        .safeParseAsync(eventDetails)
        .then((result) => {
            if (!result.success) {
                return {
                    success: result.success,
                    error: prettifyZodError(result.error),
                };
            }

            return result;
        })
        .then(async (eventUpdateDetailsValidatorResult) => {
            if (!eventUpdateDetailsValidatorResult.success)
                return eventUpdateDetailsValidatorResult;

            const validation = await validateEventUpdateDBConflicts(
                eventId,
                eventUpdateDetailsValidatorResult.data,
                categoryRepository,
                eventRepository,
            );

            if (!validation.success) {
                return {
                    success: validation.success,
                    error: validation.issues,
                };
            }

            return eventUpdateDetailsValidatorResult;
        });
}

async function validateEventUpdateDBConflicts(
    eventId,
    eventDetails,
    categoryRepository,
    eventRepository,
) {
    const validator = AsyncValidator.of(eventDetails)
        .validateAsync(async (eventDetails, issues) => {
            const categoryEntity = await categoryRepository.findCategoryByName(
                eventDetails.category,
                {
                    id: true,
                },
            );

            if (categoryEntity == null) {
                issues.push({
                    issue: 'category not found',
                    error: `category with name ${eventDetails.category} does not exists`,
                });
            }

            return categoryEntity !== null;
        })
        .validateAsync(async (eventDetails, issues) => {
            const otherEvent = await eventRepository.findEventByDateAndLocation(
                eventDetails.date,
                eventDetails.local,
                {
                    id: true,
                },
            );

            const hasConflicts =
                otherEvent !== null && otherEvent.id !== eventId;

            if (hasConflicts) {
                issues.push({
                    issue: 'conflict between events',
                    error: `there is already an event (id: ${otherEvent.id}) registered on the same date for that location`,
                });
            }

            return !hasConflicts;
        });

    return validator.executeAsync();
}
