# GET /api/vehicles/:id

## Descripción

Este endpoint permite encontrar la información de un vehículo, a partir de su identificador.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador del vehículo.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/vehicles/2
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: object. Objeto que representa el vehículo encontrado.

  Sus atributos son:

  - id: integer. Identificador del vehículo.
  - licensePlate: string. Patente del vehículo.
  - manufacturingYear: integer. Año de fabricación del vehículo.
  - totalKms: integer. Kilometraje total del vehículo.
  - location: object. Objeto que representa la sucursal a la que corresponde el vehículo. Para más información referirse a la documentación de la entidad [Sucursal](../../location/main/main.md).
  - color: object. Objeto que representa el color del vehículo. Para más información referirse a la documentación de la entidad [Color](../../color/main/main.md).
  - vehicleModel: object. Objeto que representa el modelo del vehículo. Para más información referirse a la documentación de la entidad [Modelo](../../vehicle-model/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "El vehículo ha sido encontrado",
      "data": {
        "id": 18,
        "licensePlate": "GTL529",
        "manufacturingYear": 2022,
        "totalKms": 28500,
        "location": {
          "id": 4,
          "locationName": "Centro",
          "address": "Catamarca 2631",
          "phoneNumber": "3415231769"
        },
        "color": {
          "id": 15,
          "colorName": "Gris metalizado"
        },
        "vehicleModel": {
          "id": 11,
          "vehicleModelName": "A5 Sportback",
          "transmissionType": "Manual",
          "passengerCount": 4,
          "imagePath": "1735157300189-audi_a5_sportback.jpg",
          "category": 7,
          "brand": {
            "id": 16,
            "brandName": "Audi"
          }
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
          "message": "Vehículo no encontrado"
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
