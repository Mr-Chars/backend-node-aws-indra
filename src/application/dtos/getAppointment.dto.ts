import { CountriesEnum } from "../../domain/enums/countries.enum";
import { StatusEnum } from "../../domain/enums/status.enum";

export interface GetAppointmentResponseDto {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountriesEnum;
    status: StatusEnum;
    createdAt: Date;
    updatedAt: Date;
}