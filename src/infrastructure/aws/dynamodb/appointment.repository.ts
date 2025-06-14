import { PutCommand, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Appointment } from "../../../domain/entities/appointment.entity";
import { AppointmentDynamoRepository } from "../../../domain/repositories/appointmentDynamo.repository";
import { dynamoDb } from "../../config/dynamodb.config";
import { EnvConfig } from '../../config/env.config';
import { StatusEnum } from "../../../domain/enums/status.enum";
import { CustomException } from "../../../shared/exceptions/custom.exception";
import { HTTP_STATUS_CODE } from "../../../shared/utils/constants";
import { Logger } from "../../../shared/utils/logger";

export class DynamoDBAppointmentRepository implements AppointmentDynamoRepository {
    private readonly tableName: string;
    private readonly envConfig: EnvConfig;
    constructor() {
        this.envConfig = new EnvConfig();
        this.tableName = this.envConfig.get<string>('DYNAMODB_APPOINTMENTS');
    }

    async updateAppointment(appointmentId: string): Promise<any> {

        try {
            const params: UpdateCommandInput = {
                TableName: this.tableName,
                Key: {
                    id: appointmentId,
                },
                UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#updatedAt': 'updatedAt',
                },
                ExpressionAttributeValues: {
                    ':status': StatusEnum.COMPLETED,
                    ':updatedAt': new Date().toISOString(),
                },
                ReturnValues: 'ALL_NEW',
            };

            const result = await dynamoDb.send(new UpdateCommand(params));
            return result.Attributes;
        } catch (error) {
            Logger.error(`Error al actualizar el appointment (${appointmentId}):`, error);
            throw new CustomException(`Error al actualizar el appointment (${appointmentId}):`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {

        try {
            const params = {
                TableName: this.tableName,
                IndexName: 'insuredIdIdx',
                KeyConditionExpression: 'insuredId = :insuredId',
                ExpressionAttributeValues: {
                    ':insuredId': insuredId,
                },
            };
            const result = await dynamoDb.send(new QueryCommand(params));
            return result.Items as Appointment[] || [];
        } catch (error) {
            Logger.error(`Error al obtener citas para insuredId (${insuredId}):`, error);
            throw new CustomException(`Error al obtener citas para insuredId (${insuredId})`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    }

    async createAppointment(appointment: Appointment): Promise<any> {
        
        try {
            const params = {
                TableName: this.tableName,
                Item: {
                    id: appointment.id,
                    insuredId: appointment.insuredId,
                    scheduleId: appointment.scheduleId,
                    countryISO: appointment.countryISO,
                    status: appointment.status,
                    createdAt: appointment.createdAt.toISOString(),
                    updatedAt: appointment.updatedAt.toISOString(),
                }
            };
            await dynamoDb.send(new PutCommand(params));
            return params.Item;
        } catch (error) {
            Logger.error(`Error creando el appointment`, error);
            throw new CustomException(`Error creando el appointment`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

    }



}