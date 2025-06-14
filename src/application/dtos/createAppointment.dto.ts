import { CountriesEnum } from "../../domain/enums/countries.enum";

export class CreateAppointmentDto {
    public insuredId: string;
    public scheduleId: number;
    public countryISO: CountriesEnum;

    constructor(insuredId: string, scheduleId: number, countryISO: CountriesEnum) {
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
    }
}
