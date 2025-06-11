import { AppointmentRepository } from '../../application/ports/appointmentRepository.mjs';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "sa-east-1" }));

export class DynamoRepository extends AppointmentRepository {
    constructor(tableName = 'appointment') {
        super();
        this.tableName = tableName;
    }
    async save(item) {
        await ddbDocClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: item,
            })
        );
    }
    async update(id, newState) {
        try {
            const params = {
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: 'SET #s = :status',
                ExpressionAttributeNames: {
                    '#s': 'status'
                },
                ExpressionAttributeValues: {
                    ':status': newState
                },
                ReturnValues: 'ALL_NEW'
            };
            await ddbDocClient.send(new UpdateCommand(params));
        } catch (error) {
            console.log(error);
        }
    }

    async findByValue(insuredId) {
        const command = new ScanCommand({
            TableName: this.tableName,
            FilterExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId,
            },
        });
        const response = await ddbDocClient.send(command);
        return response.Items || [];
    }

}