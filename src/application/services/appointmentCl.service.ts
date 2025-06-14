import { CustomException } from "../../shared/exceptions/custom.exception";
import { HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { Appointment } from "../../domain/entities/appointment.entity";
import { EventBridgeService } from "../../infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentClRepository } from "../../infrastructure/mysql/appointmentCl.repository";
import { appointmentClSchema } from "../validations/appointmentClSchema";


export class AppointmentClService {
    private readonly appointmentClRepository;
    private readonly eventBridgeService;

    constructor() {
        this.appointmentClRepository = new MysqlAppointmentClRepository();
        this.eventBridgeService = new EventBridgeService();
    }

    async create(appointment: Appointment): Promise<any> {
        try {
            const result = appointmentClSchema.safeParse(appointment);
            if (!result.success) {
                const zodError = result.error;
                const formattedErrors = zodError.flatten().fieldErrors;
                throw new CustomException("Datos inválidos", HTTP_STATUS_CODE.BAD_REQUEST, formattedErrors);
            }
            await this.appointmentClRepository.createAppointment(appointment);
            await this.eventBridgeService.publishAppointmentConfirmed(appointment.id);
            return appointment;
        } catch (error) {
            console.log('============ CL');
            console.log(error);
            console.log('============ CL');
        }
    }
}