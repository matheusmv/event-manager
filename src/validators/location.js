import { z } from 'zod';

const locationValidator = z.object({
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
});

export { locationValidator };
