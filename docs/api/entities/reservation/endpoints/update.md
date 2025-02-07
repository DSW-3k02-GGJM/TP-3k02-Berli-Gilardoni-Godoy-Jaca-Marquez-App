# PUT /api/reservations/:id

## Descripción

Este endpoint permite actualizar la información de una reserva, a partir de su identificador. En particular, a la hora de realizar el check-in, actualizando el campo `initialKms`, y a la hora de cancelar la reserva, actualizando el campo `cancellationDate`.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador de la reserva.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- cancellationDate: date. Fecha de cancelación de la reserva.
- initialKms: integer. Kilometraje inicial del vehículo.

### Solicitud de ejemplo

```
PUT /api/reservations/2
Cookie: access_token={token};

Content-Type: application/json

{
    "cancellationDate":"2025-02-07"
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "La reserva ha sido actualizada exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): startDate"
      }
      ```

- #### 401 Unauthorized

  - Token de autenticación no proporcionado:

    - Respuesta:

      ```
      {
          "message": "Acceso no autorizado (token no proporcionado)"
      }
      ```

- #### 404 Not Found

  - Recurso no encontrado:

    - Respuesta:

      ```
      {
          "message": "Reserva no encontrada"
      }
      ```

- #### 500 Internal Server Error

  - Error de conexión con el servidor:

    - Respuesta:

      ```
      {
          "message": "Error de conexión"
      }
      ```

## Consideraciones

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.