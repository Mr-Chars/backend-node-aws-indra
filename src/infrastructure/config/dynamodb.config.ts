import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'sa-east-1';

const dynamoClient = new DynamoDBClient({ region: REGION });

const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);

export { dynamoDb };