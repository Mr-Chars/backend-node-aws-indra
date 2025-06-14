import { Appointment } from "../entities/appointment.entity";

export interface AppointmentSnsService {
    publishAppointmentCreated(appointment: Appointment): Promise<void>;
}