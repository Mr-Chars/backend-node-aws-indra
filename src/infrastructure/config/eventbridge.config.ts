import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

const REGION = process.env.AWS_REGION || 'sa-east-1';
const eventBridgeClient = new EventBridgeClient({ region: REGION });

export { eventBridgeClient };