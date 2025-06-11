
function deepParse(bodyPath) {
    return JSON.parse(JSON.parse(JSON.parse(bodyPath).detail.data.Records[0].body).Message);
}
export async function updateAppointment(event, repository) {
    if (!event.Records.length) {
        return {
            success: false,
            statusCode: 500,
            message: "Datos del sqs no leidos"
        };
    }
    const messageBody = deepParse(event.Records[0].body);

    // Actualizar en DynamoDB
    await repository.update(messageBody.id, "completed");

    return {
        success: true,
        statusCode: 200,
    };
}