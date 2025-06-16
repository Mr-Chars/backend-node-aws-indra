import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { AppointmentEventService } from "../../../domain/services/appointmentEvent.service";
import { EnvConfig } from "../../config/env.config";
import { eventBridgeClient } from "../../config/eventbridge.config";
import { CustomException } from "../../../shared/exceptions/custom.exception";
import { HTTP_STATUS_CODE } from "../../../shared/utils/constants";
import { Logger } from "../../../shared/utils/logger";

export class EventBridgeService implements AppointmentEventService {
    private readonly envConfig: EnvConfig;
    private readonly eventBusName: string;
    private readonly eventSource: string;
    private readonly eventType: string;
    constructor() {
        this.envConfig = new EnvConfig();
        this.eventBusName = this.envConfig.get<string>('EVENT_BUS_NAME');
        this.eventSource = this.envConfig.get<string>('EVENT_SOURCE');
        this.eventType = this.envConfig.get<string>('EVENT_DETAIL_TYPE');
    }

    async publishAppointmentConfirmed(appointmentId: string): Promise<void> {

        try {
            const params = {
                Entries: [
                    {
                        Source: this.eventSource,
                        DetailType: this.eventType,
                        Detail: JSON.stringify({
                            appointmentId,
                            status: "completed"
                        }),
                        EventBusName: this.eventBusName,
                    }
                ]
            };
            const result = await eventBridgeClient.send(new PutEventsCommand(params));
            if (result.FailedEntryCount && result.FailedEntryCount > 0) {
                Logger.error('Error al publicar eventos:', JSON.stringify(result.Entries));
                throw new CustomException(`Error al publicar eventos`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            console.log('------------------------');
            console.log(error);
            console.log('------------------------');
            
            Logger.error('Error al publicar en EventBridge:', error);
            throw new CustomException(`Error al publicar en EventBridge:`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    }
}