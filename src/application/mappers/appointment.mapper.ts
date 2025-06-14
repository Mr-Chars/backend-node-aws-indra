import { v4 } from "uuid";
import { Appointment } from "../../domain/entities/appointment.entity";
import { CreateAppointmentDto } from "../dtos/createAppointment.dto";
import { StatusEnum } from "../../domain/enums/status.enum";
import { GetAppointmentResponseDto } from "../dtos/getAppointment.dto";

export class AppointmentMapper {
    static toDomain(appointment: CreateAppointmentDto): Appointment {
        return new Appointment(
            {
                id: v4(),
                insuredId: appointment.insuredId,
                scheduleId: appointment.scheduleId,
                countryISO: appointment.countryISO,
                status: StatusEnum.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );
    }

    static entityToDto(appointment: Appointment): GetAppointmentResponseDto {
        return {
            id: appointment.id,
            insuredId: appointment.insuredId,
            scheduleId: appointment.scheduleId,
            countryISO: appointment.countryISO,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            schedule: appointment.schedule
        }
    }
}
