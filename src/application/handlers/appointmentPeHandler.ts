import { SQSEvent } from "aws-lambda";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentPeService } from "../../application/services/appointmentPe.service";
import { Logger } from "../../shared/utils/logger";

const appointmentPeService = new AppointmentPeService();

export const handleSQSEvent = async (event: SQSEvent) => {
    Logger.info('=======> Running  handleSQSEvent PE');
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        const currentAppointment = JSON.parse(message.Message);
        const appointment = new Appointment({
            id: currentAppointment.id,
            insuredId: currentAppointment.insuredId,
            scheduleId: currentAppointment.scheduleId,
            countryISO: currentAppointment.countryISO,
            status: currentAppointment.status,
            createdAt: new Date(currentAppointment.createdAt),
            updatedAt: new Date(currentAppointment.updatedAt),
        });
        await appointmentPeService.create(appointment);
    }

    return { appointments: event.Records.length };
}
