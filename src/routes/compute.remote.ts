import * as z from 'zod';
import { form } from '$app/server';

export const computePost = form(
    z.object({
        a: z.number(),
        b: z.number()
    }),
    async ({ a, b }) => {
        return a + b;
    }
);
