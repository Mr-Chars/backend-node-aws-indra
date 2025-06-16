import { CustomException } from "../../shared/exceptions/custom.exception";
import { HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { Appointment } from "../../domain/entities/appointment.entity";
import { EventBridgeService } from "../../infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentPeRepository } from "../../infrastructure/mysql/appointmentPe.repository";
import { appointmentPeSchema } from "../validations/appointmentPeSchema";

export class AppointmentPeService {
    private readonly appointmentPeRepository;
    private readonly eventBridgeService;

    constructor() {
        this.appointmentPeRepository = new MysqlAppointmentPeRepository();
        this.eventBridgeService = new EventBridgeService();
    }

    async create(appointment: Appointment): Promise<any> {
        try {
            const result = appointmentPeSchema.safeParse(appointment);
            if (!result.success) {
                const zodError = result.error;
                const formattedErrors = zodError.flatten().fieldErrors;
                throw new CustomException("Datos inválidos appointmentPe.service", HTTP_STATUS_CODE.BAD_REQUEST, formattedErrors);
            }
            await this.appointmentPeRepository.createAppointment(appointment);
            await this.eventBridgeService.publishAppointmentConfirmed(appointment.id);
            return appointment;
        } catch (error) {}
    }
}