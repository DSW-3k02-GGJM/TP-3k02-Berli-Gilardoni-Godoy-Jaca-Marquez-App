# PUT /api/reservations/:id

## Descripción

Este endpoint permite actualizar la información de una reserva, a partir de su identificador.

En particular, en los siguientes casos:

- Check-in:

  - Actualización del campo `initialKms`, referente al kilometraje inicial del vehículo.

- Cancelación:

  - Actualización del campo `cancellationDate`, referente a la fecha en la que se está llevando a cabo la cancelación de la reserva.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador de la reserva.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- initialKms: integer, **opcional**. Kilometraje inicial del vehículo.
- cancellationDate: date, **opcional**. Fecha de cancelación de la reserva (Actual).

### Solicitud de ejemplo

```
PUT /api/reservations/2
Cookie: access_token={token};

Content-Type: application/json

{
    "cancellationDate": "2025-02-07"
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

  - Kilometraje inicial no numérico o negativo:

    - Respuesta:

      ```
      {
          "message": "El campo \"initialKms\" debe ser un número positivo"
      }
      ```

  - Formato incorrecto para la fecha de cancelación:

    - Respuesta:

      ```
      {
          "message": "El campo \"cancellationDate\" debe ser una fecha válida"
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
