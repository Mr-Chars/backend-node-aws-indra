import { SNSClient } from "@aws-sdk/client-sns";

const REGION = process.env.AWS_REGION || 'sa-east-1';

const snsClient = new SNSClient({
    region: REGION,
});

export { snsClient };