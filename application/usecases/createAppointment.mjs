import { randomUUID } from 'crypto';
import { validateAppointment } from '../../validation.mjs';
import { PublishCommand } from "@aws-sdk/client-sns";

export async function createAppointment(appointmentData, repository, snsClient, topicArn) {
    const validation = validateAppointment.safeParse(appointmentData);
    if (!validation.success) {
        return {
            success: false,
            statusCode: 400,
            message: 'Datos inválidos.',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const newAppointment = {
        ...appointmentData,
        id: randomUUID(),
        status: 'pending',
    };

    // Guardar en DynamoDB
    await repository.save(newAppointment);

    // Publicar en SNS
    // configuración mensaje para sns
    const params = {
        Message: JSON.stringify(newAppointment),
        TopicArn: topicArn
    };
    const resultSns = await snsClient.send(new PublishCommand(params));

    return {
        success: true,
        statusCode: 201,
        newAppointment,
        resultSns,
    };
}