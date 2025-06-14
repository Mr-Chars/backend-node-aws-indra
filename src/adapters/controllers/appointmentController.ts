import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { HANDLER_EVENTS, HTTP_STATUS_CODE_MESSAGE, HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { CustomException } from "../../shared/exceptions/custom.exception";
import { BaseBody } from "../../shared/dtos/baseBody";
import { baseBodyToApiResponse } from "../../shared/mappers/apiResponse.mapper";
import { Logger } from "../../shared/utils/logger";
import { handleAPIGatewayEvent, handleSQSEvent } from "../../application/handlers/appointmentHandler";

export const handler = async (event: any) => {
    Logger.info('=======> Running  Appointment called controlador');
    try {
        let response;
        if (HANDLER_EVENTS.API_GATEWAY in event) {
            response = await handleAPIGatewayEvent(event as APIGatewayEvent);
        } else if (HANDLER_EVENTS.SQS in event) {
            response = await handleSQSEvent(event as SQSEvent);
        } else {
            Logger.error("Tipo de evento desconocido", event);
            throw new CustomException("Tipo de evento desconocido", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return baseBodyToApiResponse(BaseBody.success(response, HTTP_STATUS_CODE_MESSAGE.OK), HTTP_STATUS_CODE.OK);
    } catch (error: any) {
        if (error instanceof CustomException) {
            return baseBodyToApiResponse(BaseBody.error(error.message, error.errors), error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
        return baseBodyToApiResponse(BaseBody.error(error.message), HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}