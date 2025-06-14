import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { AppointmentService } from "../../application/services/appointment.service";
import { HTTP_METHODS, HTTP_STATUS_CODE_MESSAGE, HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { CustomException } from "../../shared/exceptions/custom.exception";
import { Logger } from "../../shared/utils/logger";

const appointmentService = new AppointmentService();

export const handleAPIGatewayEvent = async (event: APIGatewayEvent) => {
    Logger.info('=======> Running  handleAPIGatewayEvent');
    let response;
    if (event.httpMethod === HTTP_METHODS.GET) {
        response = await appointmentService.getByInsuredId(event.pathParameters?.insuredId || '');
    } else if (event.httpMethod === HTTP_METHODS.POST) {
        response = await appointmentService.create(JSON.parse(event.body || '{}'));
    } else {
        throw new CustomException(HTTP_STATUS_CODE_MESSAGE[HTTP_STATUS_CODE.METHOD_NOT_ALLOWED], HTTP_STATUS_CODE.METHOD_NOT_ALLOWED);
    }
    return response;
}

export const handleSQSEvent = async (event: SQSEvent) => {
    Logger.info('=======> Running  handleSQSEvent');
    try {
        const data: any = JSON.parse(event.Records[0].body);
        await appointmentService.update(data?.detail?.appointmentId);
        return data;
    } catch (error) {
        return false;
    }
}
