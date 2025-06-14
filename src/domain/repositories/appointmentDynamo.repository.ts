import { Appointment } from "../entities/appointment.entity";

export interface AppointmentDynamoRepository {
    getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]>;
    createAppointment(appointment: Appointment): Promise<Appointment>;
    updateAppointment(appointmentId: string): Promise<any>;
}