import { z } from "zod";
import { CountriesEnum } from "../../domain/enums/countries.enum";

export const CreateAppointmentSchema = z.object({
    insuredId: z.string().regex(/^\d{5}$/, "El ID del asegurado debe tener exactamente 5 dígitos"),
    scheduleId: z.number()
        .int("scheduleId debe ser un número entero")
        .min(1, "scheduleId debe estar entre 1 y 10")
        .max(10, "scheduleId debe estar entre 1 y 10"),
    countryISO: z.nativeEnum(CountriesEnum, {
        required_error: "El país (countryISO) es requerido",
        invalid_type_error: "Valor de país (ISO) no válido"
    }),
});