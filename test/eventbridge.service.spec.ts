import { EventBridgeService } from '../src/infrastructure/aws/eventbridge/eventbridge.service';
import { EnvConfig } from '../src/infrastructure/config/env.config';
import { eventBridgeClient } from '../src/infrastructure/config/eventbridge.config';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../src/shared/utils/constants';

jest.mock('../src/infrastructure/config/env.config');
jest.mock('../src/infrastructure/config/eventbridge.config');
jest.mock('../src/shared/utils/logger');

describe('EventBridgeService', () => {
    let service: EventBridgeService;
    let mockEnvConfig: jest.Mocked<EnvConfig>;
    let mockEventBridgeClient: jest.Mocked<typeof eventBridgeClient>;

    const appointmentId = 'apt-123';

    beforeEach(() => {
        jest.clearAllMocks();
        mockEnvConfig = new EnvConfig() as jest.Mocked<EnvConfig>;
        mockEnvConfig.get.mockImplementation((key: string) => {
            switch (key) {
                case 'EVENT_BUS_NAME': return 'test-event-bus';
                case 'EVENT_SOURCE': return 'test-source';
                case 'EVENT_DETAIL_TYPE': return 'test-detail-type';
                default: return '';
            }
        });

        mockEventBridgeClient = eventBridgeClient as jest.Mocked<typeof eventBridgeClient>;
        mockEventBridgeClient.send.mockReset();

        service = new EventBridgeService();
    });

    describe('publishAppointmentConfirmed', () => {
        it('debería lanzar CustomException cuando falla el cliente de EventBridge', async () => {
            await expect(service.publishAppointmentConfirmed(appointmentId))
                .rejects.toThrow(CustomException);

            await expect(service.publishAppointmentConfirmed(appointmentId))
                .rejects.toMatchObject({
                    message: 'Error al publicar en EventBridge:',
                    statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
                });
        });
    });
});