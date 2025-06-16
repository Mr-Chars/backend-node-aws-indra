import { SQSEvent } from "aws-lambda";
import { AppointmentClService } from "../src/application/services/appointmentCl.service";
import { Appointment } from "../src/domain/entities/appointment.entity";
import { handleSQSEvent } from "../src/application/handlers/appointmentClHandler";

jest.mock('../src/application/services/appointmentCl.service');
jest.mock('../src/domain/entities/appointment.entity');

describe('appointmentClHandler', () => {
    let mockCreate: jest.Mock;
    const mockAppointmentInstance = {};

    beforeEach(() => {
        // Resetear todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar mock para AppointmentClService
        mockCreate = jest.fn().mockResolvedValue(undefined);
        (AppointmentClService as jest.Mock).mockImplementation(() => ({
            create: mockCreate
        }));

        // Mock para el constructor de Appointment
        (Appointment as jest.Mock).mockImplementation(() => mockAppointmentInstance);
    });

    it('should process single SQS record correctly', async () => {
        // Configurar datos de prueba
        let mockEvent: SQSEvent = {
            Records: [{
                body: JSON.stringify({
                    Message: JSON.stringify({
                        id: '123',
                        insuredId: '456',
                        scheduleId: '789',
                        countryISO: 'CL',
                        status: 'confirmed',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z'
                    })
                }),
                messageId: 'messageId',
                receiptHandle: 'receiptHandle',
                attributes: { ApproximateReceiveCount: '', SentTimestamp: '', SenderId: '', ApproximateFirstReceiveTimestamp: '' },
                messageAttributes: {},
                md5OfBody: 'md5OfBody',
                eventSource: 'aws:sqs',
                eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:your-queue',
                awsRegion: 'us-east-1',
                md5OfMessageAttributes: 'md5OfMessageAttributes',
            }]
        };

        // Ejecutar la función
        const result = await handleSQSEvent(mockEvent);

        // Verificaciones
        expect(Appointment).toHaveBeenCalledWith({
            id: '123',
            insuredId: '456',
            scheduleId: '789',
            countryISO: 'CL',
            status: 'confirmed',
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-01T00:00:00Z')
        });
        expect(result).toEqual({ appointments: 1 });
    });
});