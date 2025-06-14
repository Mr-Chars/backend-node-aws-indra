import { Appointment } from "../entities/appointment.entity";

export interface AppointmentMysqlPeRepository {
    createAppointment(appointment: Appointment): Promise<void>;
}