# GET /api/locations

## Descripción

Este endpoint permite encontrar la información de todas las sucursales.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/locations
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene las sucursales encontradas en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador de la sucursal.
  - locationName: string. Nombre de la sucursal.
  - address: string. Dirección de la sucursal.
  - phoneNumber: string. Número de teléfono de la sucursal.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message":"Todas las sucursales han sido encontradas",
      "data": [
          {
              "id": 3,
              "locationName": "Centro",
              "address": "Catamarca 2631",
              "phoneNumber": "3415231769"
          },
          {
              "id": 4,
              "locationName": "Sur",
              "address": "Presidente Roca 4285",
              "phoneNumber": "3417453849"
          }
      ]
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
