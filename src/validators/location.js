import { z } from 'zod';

export const cepValidator = z
    .string({
        required_error: 'cep is required',
        invalid_type_error: 'cep must be a string',
    })
    .regex(/^[0-9]{5}-?[0-9]{3}$/, {
        message: 'valid formats for CEP are (8 digits): 00000000 or 00000-000',
    })
    .transform((cep) => cep.replace('-', ''));

export const stateValidator = z
    .string({
        required_error: 'state is required',
        invalid_type_error: 'state must be a string',
    })
    .trim()
    .min(2, { message: 'state must be 2 or more characters long' });

export const cityValidator = z
    .string({
        required_error: 'city is required',
        invalid_type_error: 'city must be a string',
    })
    .trim()
    .min(1, { message: 'state must be 1 or more characters long' });

export const neighborhoodValidator = z
    .string({
        required_error: 'neighborhood is required',
        invalid_type_error: 'neighborhood must be a string',
    })
    .trim()
    .min(1, { message: 'neighborhood must be 1 or more characters long' });

export const streetValidator = z
    .string({
        required_error: 'street is required',
        invalid_type_error: 'street must be a string',
    })
    .trim()
    .min(1, { message: 'street must be 1 or more characters long' });

export const numberValidator = z
    .string({
        required_error: 'number is required',
        invalid_type_error: 'number must be a string',
    })
    .trim()
    .min(1, { message: 'number must be 1 or more characters long' });

const locationValidator = z.object(
    {
        cep: cepValidator,
        state: stateValidator,
        city: cityValidator,
        neighborhood: neighborhoodValidator,
        street: streetValidator,
        number: numberValidator,
        complement: z
            .string({ invalid_type_error: 'complement must be a string' })
            .optional(),
    },
    { required_error: 'local is required' },
);

export { locationValidator };
