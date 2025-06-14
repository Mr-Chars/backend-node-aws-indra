import { Appointment } from "../entities/appointment.entity";

export interface AppointmentMysqlClRepository {
    createAppointment(appointment: Appointment): Promise<void>;
}