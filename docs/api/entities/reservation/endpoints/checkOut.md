# GET /api/reservations/checkout/:id

## Descripción

Este endpoint permite procesar el check-out de una reserva.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador de la reserva.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
    - Este token debe ser enviado como una cookie en la solicitud.

#### Body

- finalKms: integer, **obligatorio**. Kilometraje final del vehículo.
- finalPrice: integer, **obligatorio**. Precio final de la reserva.
- realEndDate: date, **obligatorio**. Fecha de fin real de la reserva.

### Solicitud de ejemplo

```
GET /api/reservations/checkout/2
Cookie: access_token={token};

{
    "finalKms": 22000,
    "finalPrice": 2660,
    "realEndDate": "2025-01-24"
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
     "message": "Se ha realizado el check-out de la reserva exitosamente"
  }
  ```

## Errores

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

- El usuario autenticado debe ser un administrador (rol **'admin'**) o empleado (rol **'employee'**) para poder utilizar este endpoint.
