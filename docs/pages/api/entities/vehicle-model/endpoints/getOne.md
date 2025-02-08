# GET /api/vehicle-models/:id

## Descripción

Este endpoint permite encontrar la información de un modelo, a partir de su identificador.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador del modelo.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/vehicle-models/5
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: object. Objeto que representa el modelo encontrado.

  Sus atributos son:

  - id: integer. Identificador del modelo.
  - vehicleModelName: string. Nombre del modelo.
  - transmissionType: string. Tipo de transmisión de los vehículos del modelo.
  - passengerCount: integer. Cantidad de pasajeros que pueden transportar los vehículos del modelo.
  - imagePath: string. Ruta de la imagen representativa del modelo.
  - category: object. Objeto que representa la categoría del modelo.

    > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Categoría](../../category/main/main.md).

  - brand: object. Objeto que representa la marca del modelo.

    > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Marca](../../brand/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "El modelo ha sido encontrado",
      "data": {
          "id": 5,
          "vehicleModelName": "Cullinan",
          "transmissionType": "Manual",
          "passengerCount": 5,
          "imagePath": "1737728231555-rolls_royce_cullinan.jpg",
          "category": {
              "id": 2,
              "categoryName": "Automóvil de Alta Gama",
              "categoryDescription": "Un lujo para los más ambiciosos",
              "pricePerDay": 380,
              "depositValue": 460
          },
          "brand": {
              "id": 3,
              "brandName": "Rolls-Royce"
          }
      }
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
          "message": "Modelo no encontrado"
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

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
