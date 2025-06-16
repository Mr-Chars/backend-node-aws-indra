import { DynamoDBAppointmentRepository } from '../src/infrastructure/aws/dynamodb/appointment.repository';
import { QueryCommand, } from '@aws-sdk/lib-dynamodb';
import { EnvConfig } from '../src/infrastructure/config/env.config';
import { StatusEnum } from '../src/domain/enums/status.enum';
import { dynamoDb } from '../src/infrastructure/config/dynamodb.config';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../src/shared/utils/constants';
import { Appointment } from '../src/domain/entities/appointment.entity';
import { CountriesEnum } from '../src/domain/enums/countries.enum';

jest.mock('../src/infrastructure/config/env.config');
jest.mock('../src/infrastructure/config/dynamodb.config');

describe('DynamoDBAppointmentRepository', () => {
    let repository: DynamoDBAppointmentRepository;
    let mockEnvConfig: jest.Mocked<EnvConfig>;

    // Datos de prueba
    const appointmentId = 'apt-123';
    const mockUpdatedAttributes = {
        id: appointmentId,
        status: StatusEnum.COMPLETED,
        updatedAt: '2023-01-01T00:00:00.000Z',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockEnvConfig = new EnvConfig() as jest.Mocked<EnvConfig>;
        mockEnvConfig.get.mockReturnValue('appointments-table');
        (dynamoDb.send as jest.Mock).mockReset();

        repository = new DynamoDBAppointmentRepository();
    });

    describe('createAppointment', () => {
        const mockResponse = new Appointment({
            id: 'appointment-789',
            insuredId: '22123',
            scheduleId: 1,
            countryISO: CountriesEnum.CL,
            status: StatusEnum.COMPLETED,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
        });
        const mockAppointments = {
            id: 'appointment-789',
            insuredId: 'insured-123',
            scheduleId: 1,
            countryISO: CountriesEnum.CL,
            status: StatusEnum.COMPLETED,
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-02T00:00:00Z')
        };
        it('debería retornar citas cuando existen para el insuredId', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({
                Items: mockAppointments
            });

            const result = await repository.createAppointment(mockResponse);

            expect(result.insuredId).toEqual(mockResponse.insuredId);
        });
    });

    describe('getAppointmentsByInsuredId', () => {
        const insuredId = '55123';
        const mockAppointments = [
            {
                id: 'apt-1',
                insuredId: 'insured-123',
                date: '2023-01-01',
                status: 'confirmed'
            },
            {
                id: 'apt-2',
                insuredId: 'insured-123',
                date: '2023-01-02',
                status: 'completed'
            }
        ];
        it('debería retornar citas cuando existen para el insuredId', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({
                Items: mockAppointments
            });

            const result = await repository.getAppointmentsByInsuredId(insuredId);

            expect(result).toEqual(mockAppointments);
            expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(QueryCommand));
        });
    });

    describe('updateAppointment', () => {
        it('debería actualizar una cita correctamente', async () => {
            (dynamoDb.send as jest.Mock).mockResolvedValue({
                Attributes: mockUpdatedAttributes
            });

            const result = await repository.updateAppointment(appointmentId);

            expect(result).toEqual(mockUpdatedAttributes);
        });

        it('debería lanzar CustomException cuando DynamoDB falla', async () => {
            const dynamoError = new Error('Error de DynamoDB');
            (dynamoDb.send as jest.Mock).mockRejectedValue(dynamoError);

            await expect(repository.updateAppointment(appointmentId))
                .rejects.toThrow(CustomException);

            await expect(repository.updateAppointment(appointmentId))
                .rejects.toMatchObject({
                    message: `Error al actualizar el appointment (${appointmentId}):`,
                    statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
                });
        });
    });
});