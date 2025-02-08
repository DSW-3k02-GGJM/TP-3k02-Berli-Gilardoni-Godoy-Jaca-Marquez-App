# PUT /api/reservations/checkout/:id

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

- realEndDate: date, **obligatorio**. Fecha de fin real de la reserva.
- finalKms: integer, **obligatorio**. Kilometraje final del vehículo.
- finalPrice: integer, **obligatorio**. Precio final de la reserva.

### Solicitud de ejemplo

```
GET /api/reservations/checkout/2
Cookie: access_token={token};

{
    "realEndDate": "2025-01-24",
    "finalKms": 22000,
    "finalPrice": 2660
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
      "message": "Se ha realizado el check-out de la reserva exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): finalKms"
      }
      ```

  - Formato incorrecto para la fecha de fin real:

    - Respuesta:

      ```
      {
          "message": "El campo \"realEndDate\" debe ser una fecha válida"
      }
      ```

  - Kilometraje y/o precio final no numéricos o negativos:

    - Respuesta:

      ```
      {
          "message": "El campo \"finalKms\" debe ser un número positivo"
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

- El precio final de la reserva se determina según las siguientes condiciones:

  1. Si el cliente devuelve el vehículo **antes o en la fecha de fin planeada** (`realEndDate ≤ plannedEndDate`):

     - **Si el depósito en garantía abonado inicialmente es reembolsable**:
       ```
       (pricePerDay * (plannedEndDate - startDate)) - depositValue
       ```
     - **Si el depósito en garantía abonado inicialmente no es reembolsable**:
       ```
       pricePerDay * (plannedEndDate - startDate)
       ```

  2. Si el cliente devuelve el vehículo **después de la fecha de fin planeada** (`realEndDate > plannedEndDate`):

     - **Si el depósito en garantía abonado inicialmente es reembolsable**:
       ```
       (pricePerDay * (realEndDate - startDate)) - depositValue
       ```
     - **Si el depósito en garantía abonado inicialmente no es reembolsable**:

       ```
       pricePerDay * (realEndDate - startDate)
       ```

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) o empleado (rol **'employee'**) para poder utilizar este endpoint.
