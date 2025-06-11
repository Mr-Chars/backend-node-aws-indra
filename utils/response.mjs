export function successResponse(data) {
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}

export function errorResponse(statusCode, message) {
    return {
        statusCode,
        body: JSON.stringify({ error: message }),
    };
}