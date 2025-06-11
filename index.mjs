import { SNSClient, } from "@aws-sdk/client-sns";
import { createAppointment } from './application/usecases/createAppointment.mjs';
import { updateAppointment } from './application/usecases/updateAppointment.mjs';
import { getAppointment } from './application/usecases/getAppointment.mjs';
import { DynamoRepository } from './adapters/dynamodb/dynamoRepository.mjs';
import { successResponse, errorResponse } from './utils/response.mjs';

const snsClient = new SNSClient({});
const repository = new DynamoRepository();
const topicArn = 'arn:aws:sns:sa-east-1:994268145676:SNS_PE'; // como aspecto de mejora esto puede venir de un env o vault

export const handler = async (event) => {
  try {
    const method = event?.httpMethod || event?.requestContext?.http?.method;
    if (method === 'POST') {
      const appointment = JSON.parse(event.body);
      const result = await createAppointment(appointment, repository, snsClient, topicArn);

      if (!result.success) {
        return {
          statusCode: result.statusCode,
          body: JSON.stringify({
            message: result.message,
            errors: result.errors,
          }),
        };
      }

      return {
        statusCode: result.statusCode,
        body: JSON.stringify({
          status: true,
        }),
      };
    }

    if (method === 'GET') {
      const insuredId = event.queryStringParameters?.insuredId;
      const result = await getAppointment(insuredId, repository);
      return successResponse({
        appointments: result
      });
    }

    if (event.Records) {
      const result = await updateAppointment(event, repository);
      if (!result.success) {
        return {
          statusCode: result.statusCode,
          body: JSON.stringify({
            message: result.message,
            errors: result.errors,
          }),
        };
      }
      return successResponse({});
    }

    return errorResponse(405, 'Method Not Allowed');
  } catch (err) {
    return errorResponse(500, err.message);
  }
};
