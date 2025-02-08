# POST /api/reservations/create-user-reservation

## Descripción

Este endpoint permite crear una reserva, desde el punto de vista de un cliente.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- reservationDate: date **obligatorio**. Fecha de registro la reserva (actual).
- startDate: date **obligatorio**. Fecha de inicio de la reserva.
- plannedEndDate: date **obligatorio**. Fecha de fin planificada de la reserva.
- vehicle: integer, **obligatorio**. Identificador del vehículo asociado a la reserva.

### Solicitud de ejemplo

```
POST /api/reservations/create-admin-reservation
Cookie: access_token={token};

Content-Type: application/json

{
    "reservationDate": "2025-02-07",
    "startDate": "2025-02-08",
    "plannedEndDate": "2025-02-15",
    "vehicle": 4
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 201 Created

  ```
  {
      "message": "Reserva exitosa"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): "startDate"
      }
      ```

  - Formato incorrecto para la fecha de registro, fecha de inicio y/o fecha de fin planeada de la reserva:

    - Respuesta de ejemplo:

      ```
      {
          "message": "El campo \"startDate\" debe ser una fecha válida"
      }
      ```

  - Vehículo reservado por otro usuario:

    - Respuesta:

      ```
      {
          "message": "El vehículo ya no está disponible para las fechas seleccionadas. Por favor, seleccione otro vehículo o intente con otro rango de fechas."
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

- #### 403 Forbidden

  - Acceso restringido por falta de permisos:

    - Respuesta:

      ```
      {
          "message": "Acceso restringido (rol sin permisos)"
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

- El usuario autenticado debe ser un cliente (rol **'client'**) para poder utilizar este endpoint.
