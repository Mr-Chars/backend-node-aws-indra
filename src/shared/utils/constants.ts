export const HANDLER_EVENTS = {
    API_GATEWAY: "httpMethod",
    SQS: "Records",
}

export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    OPTIONS: "OPTIONS",
}

export const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
}

export const HTTP_STATUS_CODE_MESSAGE: any = {
    200: "OK",
    201: "Creado",
    204: "Sin contenido",
    400: "Solicitud incorrecta",
    401: "No autorizado",
    403: "Prohibido",
    404: "No encontrado",
    405: "Método no permitido",
    409: "Conflicto",
    422: "Entidad no procesable",  
    500: "Error interno del servidor",
}