import { CountriesEnum } from "../../domain/enums/countries.enum";
import { StatusEnum } from "../../domain/enums/status.enum";
import { z } from "zod";

export const appointmentClSchema = z.object({
    id: z.string().uuid().optional(),
    insuredId: z.string().regex(/^\d{5}$/, "El ID del asegurado debe tener exactamente 5 dígitos"),
    scheduleId: z.number(),
    countryISO: z.nativeEnum(CountriesEnum, {
        required_error: "El país (countryISO) es requerido",
        invalid_type_error: "Valor de país (ISO) no válido"
    }),
    status: z.nativeEnum(StatusEnum,{
        required_error: "El estado (status) es requerido",
        invalid_type_error: "Valor de estado (status) no válido"
    }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),

});