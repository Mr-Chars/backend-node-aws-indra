import { CountriesEnum } from "../enums/countries.enum";
import { StatusEnum } from "../enums/status.enum";
import { Schedule } from './schedule.entity';

export class Appointment {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountriesEnum;
    status: StatusEnum;
    createdAt: Date;
    updatedAt: Date;
    schedule?: Schedule;

    constructor(
        params: {
            id: string,
            insuredId: string,
            scheduleId: number,
            countryISO: CountriesEnum,
            status: StatusEnum,
            createdAt: Date,
            updatedAt: Date,
            schedule?: Schedule
        }
    ) {
        this.id = params.id;
        this.insuredId = params.insuredId;
        this.scheduleId = params.scheduleId;
        this.countryISO = params.countryISO;
        this.status = params. status;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.schedule = params.schedule;
    }
}
