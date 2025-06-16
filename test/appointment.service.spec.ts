import { CreateAppointmentDto } from "../src/application/dtos/createAppointment.dto";
import { GetAppointmentResponseDto } from "../src/application/dtos/getAppointment.dto";
import { AppointmentMapper } from "../src/application/mappers/appointment.mapper";
import { AppointmentService } from "../src/application/services/appointment.service";
import { Appointment } from "../src/domain/entities/appointment.entity";
import { CountriesEnum } from "../src/domain/enums/countries.enum";
import { StatusEnum } from "../src/domain/enums/status.enum";
import { DynamoDBAppointmentRepository } from '../src/infrastructure/aws/dynamodb/appointment.repository';
import { SnsService } from '../src/infrastructure/aws/sns/sns.service';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from "../src/shared/utils/constants";

jest.mock('../src/infrastructure/aws/dynamodb/appointment.repository');
jest.mock('../src/infrastructure/aws/sns/sns.service');
jest.mock('../src/application/mappers/appointment.mapper');

describe('AppointmentService', () => {
    let service: AppointmentService;
    let mockAppointmentRepository: jest.Mocked<DynamoDBAppointmentRepository>;
    let mockSnsService: jest.Mocked<SnsService>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockAppointmentRepository = new DynamoDBAppointmentRepository() as jest.Mocked<DynamoDBAppointmentRepository>;
        mockSnsService = new SnsService() as jest.Mocked<SnsService>;

        service = new AppointmentService();
        (service as any).appointmentRepository = mockAppointmentRepository;
        (service as any).snsService = mockSnsService;
    });

    describe('create', () => {
        const validAppointmentData: CreateAppointmentDto = {
            insuredId: '12345',
            scheduleId: 9,
            countryISO: CountriesEnum.CL
        };

        const mockEntityResponse = {
            id: 'appointment-123',
            insuredId: '12345',
            scheduleId: 9,
            countryISO: CountriesEnum.CL,
            status: StatusEnum.COMPLETED,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        };

        const mockDtoResponse: GetAppointmentResponseDto = {
            id: 'appointment-123',
            insuredId: '12345',
            scheduleId: 9,
            countryISO: CountriesEnum.CL,
            status: StatusEnum.COMPLETED,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        };

        beforeEach(() => {
            mockAppointmentRepository.createAppointment.mockResolvedValue(mockEntityResponse);
        });

        it('debería crear una cita correctamente con datos válidos', async () => {
            const mapperToDomainSpy = jest.spyOn(AppointmentMapper, 'toDomain')
                .mockImplementation(() => mockEntityResponse);

            const mapperToDtoSpy = jest.spyOn(AppointmentMapper, 'entityToDto')
                .mockImplementation(() => mockDtoResponse);

            const result = await service.create(validAppointmentData);

            expect(result).toEqual(mockDtoResponse);
            // Verificar la cadena de llamadas
            expect(mapperToDomainSpy).toHaveBeenCalledWith(validAppointmentData);
            expect(mapperToDtoSpy).toHaveBeenCalledWith(mockEntityResponse);

            // Limpiar spies
            mapperToDomainSpy.mockRestore();
            mapperToDtoSpy.mockRestore();
        });
    });

    describe('update', () => {
        it('debería actualizar una cita correctamente', async () => {
            const appointmentId = 'appointment-123';
            const mockResponse = { id: appointmentId, status: 'updated' };
            mockAppointmentRepository.updateAppointment.mockResolvedValue(mockResponse);

            const result = await service.update(appointmentId);

            expect(result).toEqual(mockResponse);
            expect(mockAppointmentRepository.updateAppointment).toHaveBeenCalledWith(appointmentId);
        });

        it('debería lanzar una excepción si no se proporciona appointmentId', async () => {
            await expect(service.update('')).rejects.toThrow(CustomException);
            await expect(service.update('')).rejects.toMatchObject({
                message: 'appointmentId not found',
                statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
            });
        });
    });

    describe('getByInsuredId', () => {
        it('debería obtener citas por insuredId correctamente', async () => {
            const insuredId = 'insured-123';
            const mockResponse = [new Appointment({
                id: 'appointment-789',
                insuredId: 'insured-123',
                scheduleId: 1,
                countryISO: CountriesEnum.CL,
                status: StatusEnum.COMPLETED,
                createdAt: new Date('2023-01-01T00:00:00Z'),
                updatedAt: new Date('2023-01-02T00:00:00Z')
            })];
            mockAppointmentRepository.getAppointmentsByInsuredId.mockResolvedValue(mockResponse);

            const result = await service.getByInsuredId(insuredId);

            expect(result).toEqual(mockResponse);
            expect(mockAppointmentRepository.getAppointmentsByInsuredId).toHaveBeenCalledWith(insuredId);
        });

        it('debería lanzar una excepción si no se proporciona insuredId', async () => {
            await expect(service.getByInsuredId('')).rejects.toThrow(CustomException);
            await expect(service.getByInsuredId('')).rejects.toMatchObject({
                message: 'insuredId not found',
                statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
            });
        });
    });
});