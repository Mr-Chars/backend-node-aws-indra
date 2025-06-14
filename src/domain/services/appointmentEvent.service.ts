export interface AppointmentEventService {
    publishAppointmentConfirmed(appointmentId: string): Promise<void>;
}