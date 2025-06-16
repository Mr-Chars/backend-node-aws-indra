import { CustomException } from "../../shared/exceptions/custom.exception";
import { zodToCustomException } from "../../shared/mappers/customException.mapper";
import { HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { Logger } from "../../shared/utils/logger";
import { DynamoDBAppointmentRepository } from "../../infrastructure/aws/dynamodb/appointment.repository";
import { SnsService } from "../../infrastructure/aws/sns/sns.service";
import { CreateAppointmentDto } from "../dtos/createAppointment.dto";
import { GetAppointmentResponseDto } from "../dtos/getAppointment.dto";
import { AppointmentMapper } from "../mappers/appointment.mapper";
import { CreateAppointmentSchema } from "../validations/createAppointmentSchema";

export class AppointmentService {
    private readonly appointmentRepository;
    private readonly snsService;
    constructor() {
        this.appointmentRepository = new DynamoDBAppointmentRepository();
        this.snsService = new SnsService();
    }

    async create(data: CreateAppointmentDto): Promise<any> {
        // Logger.info('=======> Running createAppointment');
        try {
            const result = CreateAppointmentSchema.safeParse(data);

            if (!result.success) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    name: "CustomException",
                    errors: zodToCustomException(result.error),
                }
            }

            const appointment = AppointmentMapper.toDomain(data);
            const response = await this.appointmentRepository.createAppointment(appointment);
            await this.snsService.publishAppointmentCreated(appointment);
            return AppointmentMapper.entityToDto(response);
        } catch (error) { }
    }

    async update(appointmentId: string): Promise<any> {
        // Logger.info('=======> Running updateAppointment');
        if (!appointmentId) {
            throw new CustomException("appointmentId not found", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentRepository.updateAppointment(appointmentId);
    }

    async getByInsuredId(insuredId: string): Promise<any> {
        // Logger.info('=======> Running getAppointmentsByInsuredId');
        if (!insuredId) {
            throw new CustomException("insuredId not found", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentRepository.getAppointmentsByInsuredId(insuredId);
    }
}