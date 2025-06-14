# Documentación del API - Prueba técnica Rimac

## Servicios y tecnologías:

- TypeScript
- Nodejs
- API Gateway
- AWS Lambda
- DynamoDB
- SNS
- SQS
- MySQL (aws)
- EventBridge

## Arquitectura del proyecto

El flujo del proyecto se basa en la comunicación de diversas tecnologías como servicios, lenguajes de programación y bases de datos, el esquema arquitectonico que se implementó fue la **arquitectura orientada a eventos** para la interación general y **arquitectura hexagonal** para los endpoint codificados.

1. Todo inica desde una petición POST hacia el servicio (appointment) API Gateway.
2. La información es almacenada en DynamoDB y se emite un evento en SNS indicando el país.
3. Se envía la información hacia el SQS correspondiente.
4. El lambda que es activado por el SQS almacena los datos en MySQL y emite un evento de confirmación en EventBridge.
5. Producto del evento emitido por EventBridge se actualiza el estado de la cita a completado.

## Endpoints

### 1. Create appointment

**Propósito:** `Crear una nueva cita en base a la información ingresada`
**Método:** `POST`
**URL:**  
`https://20a8zb3aa0.execute-api.sa-east-1.amazonaws.com/dev/appointments`

**Body del request (formato JSON):**

```json
{
  "insuredId": "00398",
  "scheduleId": 3,
  "countryISO": "PE"
}
```
**Respuesta esperada:**

```json
{
    "success": true,
    "data": {
        "id": "091239e9-a03a-4b8c-a8b1-c6cac576e861",
        "insuredId": "00398",
        "scheduleId": 3,
        "countryISO": "PE",
        "status": "PENDING",
        "createdAt": "2025-06-14T21:15:25.844Z",
        "updatedAt": "2025-06-14T21:15:25.844Z"
    }
}
```
### 2. Get appointment

**Propósito:** `Obtener datos de una cita en base al id del asegurado`
**Método:** `GET`
  
**URL:**  
`https://20a8zb3aa0.execute-api.sa-east-1.amazonaws.com/dev/appointments/{insuredId}`

**Ejemplo:**  
`https://20a8zb3aa0.execute-api.sa-east-1.amazonaws.com/dev/appointments/00007`

**Respuesta esperada:**

```json
{
    "success": true,
    "data": [
        {
            "insuredId": "00398",
            "scheduleId": 3,
            "updatedAt": "2025-06-14T20:51:18.076Z",
            "status": "COMPLETED",
            "createdAt": "2025-06-14T20:46:16.928Z",
            "id": "bc654bff-a6c3-456b-b802-0de40908256a",
            "countryISO": "PE"
        },
        {
            "insuredId": "00398",
            "scheduleId": 3,
            "updatedAt": "2025-06-14T21:15:26.990Z",
            "status": "COMPLETED",
            "createdAt": "2025-06-14T21:15:25.844Z",
            "id": "091239e9-a03a-4b8c-a8b1-c6cac576e861",
            "countryISO": "PE"
        },
        {
            "insuredId": "00398",
            "scheduleId": 3,
            "updatedAt": "2025-06-14T20:51:33.445Z",
            "status": "COMPLETED",
            "createdAt": "2025-06-14T20:45:33.004Z",
            "id": "e4e3fea8-33fa-4726-a1ee-fd84ce69f32f",
            "countryISO": "CL"
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

