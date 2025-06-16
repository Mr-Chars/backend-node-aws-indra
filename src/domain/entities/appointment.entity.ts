import { CountriesEnum } from "../enums/countries.enum";
import { StatusEnum } from "../enums/status.enum";

export class Appointment {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountriesEnum;
    status: StatusEnum;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        params: {
            id: string,
            insuredId: string,
            scheduleId: number,
            countryISO: CountriesEnum,
            status: StatusEnum,
            createdAt: Date,
            updatedAt: Date,
        }
    ) {
        this.id = params.id;
        this.insuredId = params.insuredId;
        this.scheduleId = params.scheduleId;
        this.countryISO = params.countryISO;
        this.status = params.status;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}
