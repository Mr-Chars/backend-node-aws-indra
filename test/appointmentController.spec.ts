import { handler } from "../src/adapters/controllers/appointmentController"
import { BaseBody } from "../src/shared/dtos/baseBody";
import { baseBodyToApiResponse } from "../src/shared/mappers/apiResponse.mapper";
import { HANDLER_EVENTS, HTTP_STATUS_CODE, HTTP_STATUS_CODE_MESSAGE } from "../src/shared/utils/constants";
describe('appointmentController', () => {
    const mockHandleSQSEvent = jest.fn();
    const mockHandleAPIGatewayEvent = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        require('../src/application/handlers/appointmentHandler').handleSQSEvent = mockHandleSQSEvent;
        require('../src/application/handlers/appointmentHandler').handleAPIGatewayEvent = mockHandleAPIGatewayEvent;
    });

    it('should log and process API_GATEWAY event correctly', async () => {
        // Configurar datos de prueba
        const mockApiGtEvent = { [HANDLER_EVENTS.API_GATEWAY]: true, records: [] };
        const mockResponse = { success: true };

        mockHandleAPIGatewayEvent.mockResolvedValue(mockResponse);

        const result = await handler(mockApiGtEvent);

        // Verificaciones
        expect(mockHandleAPIGatewayEvent).toHaveBeenCalledWith(mockApiGtEvent);

        const expectedApiResponse = baseBodyToApiResponse(
            BaseBody.success(mockResponse, HTTP_STATUS_CODE_MESSAGE.OK),
            HTTP_STATUS_CODE.OK
        );
        expect(result).toEqual(expectedApiResponse);
    });

    it('should log and process SQS event correctly', async () => {
        // Configurar datos de prueba
        const mockSQSEvent = { [HANDLER_EVENTS.SQS]: true, records: [] };
        const mockResponse = { success: true };

        mockHandleSQSEvent.mockResolvedValue(mockResponse);

        const result = await handler(mockSQSEvent);

        // Verificaciones
        expect(mockHandleSQSEvent).toHaveBeenCalledWith(mockSQSEvent);

        const expectedApiResponse = baseBodyToApiResponse(
            BaseBody.success(mockResponse, HTTP_STATUS_CODE_MESSAGE.OK),
            HTTP_STATUS_CODE.OK
        );
        expect(result).toEqual(expectedApiResponse);
    });

    it('should throw and handle CustomException for unknown event type', async () => {
        // Configurar datos de prueba
        const unknownEvent = { someUnknownEvent: true };

        // Ejecutar la función
        const result = await handler(unknownEvent);

        const expectedApiResponse = baseBodyToApiResponse(
            BaseBody.error("Tipo de evento desconocido", undefined),
            HTTP_STATUS_CODE.BAD_REQUEST
        );
        expect(result).toEqual(expectedApiResponse);
    });

    it('should handle generic errors', async () => {
        // Configurar datos de prueba
        const mockSQSEvent = { [HANDLER_EVENTS.SQS]: true };
        const genericError = new Error("Error genérico");

        // Configurar el mock para que lance error
        mockHandleSQSEvent.mockRejectedValue(genericError);

        // Ejecutar la función
        const result = await handler(mockSQSEvent);

        // Verificaciones
        const expectedApiResponse = baseBodyToApiResponse(
            BaseBody.error("Error genérico"),
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
        );
        expect(result).toEqual(expectedApiResponse);
    });

});