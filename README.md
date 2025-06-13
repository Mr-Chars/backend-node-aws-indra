# Documentación del API - Prueba técnica Rimac

La aplicación es un sistema serverless para la **gestión de citas médicas** en Perú (PE) y Chile (CL), que utiliza los siguientes servicios y tecnologías:

- API Gateway
- AWS Lambda
- DynamoDB
- SNS
- SQS
- EventBridge
- MySQL
- TypeScript

## Arquitectura General

El sistema está diseñado utilizando una **arquitectura orientada a eventos**, donde cada cita médica pasa por varias etapas de procesamiento automático:

1. Se recibe una solicitud a través de API Gateway.
2. La información de la cita se guarda inicialmente en DynamoDB.
3. Se publica un evento en SNS indicando el país.
4. Se envía la cita a una cola SQS correspondiente (PE o CL).
5. Lambdas específicas procesan las citas y las almacenan en MySQL.
6. Se publica un evento de confirmación en EventBridge.
7. Finalmente, se actualiza el estado de la cita como completada en DynamoDB.

## Endpoints disponibles

### 1. Crear Cita Médica

**Método:** `POST`  
**URL:**  
`https://k4nit9jt3h.execute-api.sa-east-1.amazonaws.com/dev/appointments`

**Body del request (formato JSON):**

```json
{
  "insuredId": "00007",
  "scheduleId": 7,
  "countryISO": "PE"
}
```
**Respuesta esperada: (formato JSON):**

```json
{
    "success": true,
    "data": {
        "id": "402d5e63-6b55-4765-ad8a-c6bcd1946413",
        "insuredId": "00007",
        "scheduleId": 7,
        "countryISO": "PE",
        "status": "PENDING",
        "createdAt": "2025-04-28T05:45:40.729Z",
        "updatedAt": "2025-04-28T05:45:40.729Z"
    }
}
```
### 2. Consultar Citas Médicas de un asegurado

**Método:** `GET`
  
**URL:**  
`https://k4nit9jt3h.execute-api.sa-east-1.amazonaws.com/dev/appointments/{insuredId}`

**Ejemplo de consulta:**  
`https://k4nit9jt3h.execute-api.sa-east-1.amazonaws.com/dev/appointments/00007`

**Respuesta esperada: (formato JSON):**

```json
{
    "success": true,
    "data": [
        {
            "insuredId": "00007",
            "scheduleId": 7,
            "updatedAt": "2025-04-28T05:10:07.055Z",
            "status": "COMPLETED",
            "createdAt": "2025-04-28T05:10:05.735Z",
            "id": "48f8c3fc-3448-4c24-9217-a3ba5e348543",
            "countryISO": "PE"
        },
        {
            "insuredId": "00007",
            "scheduleId": 7,
            "updatedAt": "2025-04-28T05:45:41.916Z",
            "status": "COMPLETED",
            "createdAt": "2025-04-28T05:45:40.729Z",
            "id": "402d5e63-6b55-4765-ad8a-c6bcd1946413",
            "countryISO": "PE"
        }
    ]
}
```

### 3. Diagrama
![Diagrama del reto](https://i.postimg.cc/gjj5NsCW/Sin-t-tulo.png)

## 4. Documentación Swagger

Puedes acceder a la documentación completa de los endpoints a través de Swagger en el siguiente enlace:

🔗 [Ver Documentación Swagger](https://k4nit9jt3h.execute-api.sa-east-1.amazonaws.com/dev/swagger)

## 5. Pruebas unitarias
![Resultados del testing](https://i.postimg.cc/TYw8g2F4/testing.png)

