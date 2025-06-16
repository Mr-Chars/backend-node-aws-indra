import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { AppointmentService } from "../src/application/services/appointment.service";
import { handleAPIGatewayEvent, handleSQSEvent } from "../src/application/handlers/appointmentHandler";
import { HTTP_METHODS, HTTP_STATUS_CODE, HTTP_STATUS_CODE_MESSAGE } from "../src/shared/utils/constants";
import { CustomException } from "../src/shared/exceptions/custom.exception";

const mockGetByInsuredId = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('../src/application/services/appointment.service', () => {
    return {
        AppointmentService: jest.fn().mockImplementation(() => ({
            getByInsuredId: (...args: any[]) => mockGetByInsuredId(...args),
            create: (...args: any[]) => mockCreate(...args),
            update: (...args: any[]) => mockUpdate(...args),
        })),
    };
});

describe('appointmentHandler', () => {
    beforeEach(() => {
        mockGetByInsuredId.mockClear();
        mockCreate.mockClear();
        mockUpdate.mockClear();
    });

    describe('handleAPIGatewayEvent', () => {
        it('should work with GET', async () => {
            const expected = [{ id: '1' }, { id: '2' }];
            mockGetByInsuredId.mockResolvedValue(expected);

            const result = await handleAPIGatewayEvent({
                httpMethod: HTTP_METHODS.GET,
                pathParameters: { insuredId: '123' },
                body: null
            } as any);

            expect(result).toEqual(expected);
        });

        it('should call create for POST requests', async () => {
            // Configurar datos de prueba
            const appointmentData = { insuredId: '123', scheduleId: '456' };
            const mockEvent: APIGatewayEvent = {
                httpMethod: HTTP_METHODS.POST,
                pathParameters: null,
                body: JSON.stringify(appointmentData)
            } as any;

            const mockResponse = { id: '789', ...appointmentData };
            mockCreate.mockResolvedValue(mockResponse);

            // Ejecutar la función
            const result = await handleAPIGatewayEvent(mockEvent);

            // Verificaciones
            expect(mockCreate).toHaveBeenCalledWith(appointmentData);
            expect(result).toEqual(mockResponse);
        });

        it('should throw CustomException for unsupported HTTP methods', async () => {
            // Configurar datos de prueba
            const mockEvent: APIGatewayEvent = {
                httpMethod: 'PUT',
                pathParameters: null,
                body: null
            } as any;

            // Ejecutar y verificar
            await expect(handleAPIGatewayEvent(mockEvent)).rejects.toThrow(
                new CustomException(
                    HTTP_STATUS_CODE_MESSAGE[HTTP_STATUS_CODE.METHOD_NOT_ALLOWED],
                    HTTP_STATUS_CODE.METHOD_NOT_ALLOWED
                )
            );
        });
    });
    describe('handleSQSEvent', () => {
        it('should call update with appointmentId from SQS message', async () => {
            // Configurar datos de prueba
            const mockEvent: SQSEvent = {
                Records: [{
                    body: JSON.stringify({
                        detail: { appointmentId: 'app123' }
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

            mockUpdate.mockResolvedValue(true);

            // Ejecutar la función
            const result = await handleSQSEvent(mockEvent);

            // Verificaciones
            expect(mockUpdate).toHaveBeenCalledWith('app123');
            expect(result).toEqual({
                detail: { appointmentId: 'app123' }
            });
        });

        it('should handle empty Records array', async () => {
            const mockEvent: SQSEvent = {
                Records: []
            };

            const result = await handleSQSEvent(mockEvent);
            expect(result).toBe(false);
        });
    });
});