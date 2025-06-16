import { SnsService } from '../src/infrastructure/aws/sns/sns.service';
import { PublishCommand } from '@aws-sdk/client-sns';
import { EnvConfig } from '../src/infrastructure/config/env.config';
import { snsClient } from '../src/infrastructure/config/sns.config';
import { Logger } from '../src/shared/utils/logger';
import { Appointment } from '../src/domain/entities/appointment.entity';
import { CountriesEnum } from '../src/domain/enums/countries.enum';
import { StatusEnum } from '../src/domain/enums/status.enum';

jest.mock('../src/infrastructure/config/env.config');
jest.mock('../src/infrastructure/config/sns.config');
jest.mock('../src/shared/utils/logger');

describe('SnsService', () => {
    let service: SnsService;
    let mockEnvConfig: jest.Mocked<EnvConfig>;
    let mockSnsClient: jest.Mocked<typeof snsClient>;

    const mockAppointment: Appointment = {
        id: 'apt-123',
        scheduleId: 3,
        insuredId: '22456',
        countryISO: CountriesEnum.CL,
        status: StatusEnum.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Configurar mocks
        mockEnvConfig = new EnvConfig() as jest.Mocked<EnvConfig>;
        mockEnvConfig.get.mockReturnValue('arn:aws:sns:us-east-1:123456789012:appointment-created');

        mockSnsClient = snsClient as jest.Mocked<typeof snsClient>;
        mockSnsClient.send.mockReset();

        // Instanciar servicio
        service = new SnsService();
    });

    describe('publishAppointmentCreated', () => {
        it('debería publicar en SNS correctamente', async () => {
            // Configurar mock para éxito
            mockSnsClient.send.mockResolvedValue({} as never);

            await expect(service.publishAppointmentCreated(mockAppointment))
                .resolves.not.toThrow();

            // Verificar parámetros del comando
            expect(mockSnsClient.send).toHaveBeenCalledWith(expect.any(PublishCommand));
            const command = mockSnsClient.send.mock.calls[0][0];
            expect(command.input).toEqual({
                Message: JSON.stringify(mockAppointment),
                TopicArn: undefined,
                MessageAttributes: {
                    countryISO: {
                        DataType: 'String',
                        StringValue: 'CL'
                    }
                }
            });

            // Verificar que no se registró error
            expect(Logger.log).not.toHaveBeenCalledWith('Error al publicar en SNS');
        });
    });
});