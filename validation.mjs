import { z } from 'zod';
export const validateAppointment = z.object({
    insuredId: z.string()
        .regex(/^\d{5,5}$/, 'El insuredId debe tener 5 dígitos numéricos'),
    countryISO: z.enum(['PE', 'CL'], {
        errorMap: () => ({ message: 'countryISO debe ser "PE" o "CL"' })
    }),
    scheduleId: z.
        number({ invalid_type_error: 'El id de la agenda debe ser un número' })
        .int()
})