# GET /api/vehicles

## Descripción

Este endpoint permite encontrar la información de todos los vehículos.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/vehicles
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene los vehículos encontrados en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador del vehículo.
  - licensePlate: string. Patente del vehículo.
  - manufacturingYear: integer. Año de fabricación del vehículo.
  - totalKms: integer. Kilometraje total del vehículo.
  - location: object. Objeto que representa la sucursal a la que corresponde el vehículo.

  > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Sucursal](../../location/main/main.md).

  - color: object. Objeto que representa el color del vehículo.

  > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Color](../../color/main/main.md).

  - vehicleModel: object. Objeto que representa el modelo del vehículo.

  > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Modelo](../../vehicle-model/main/main.md).

  > ⚠️ Nota: El modelo contendrá a su vez una [Marca](../../brand/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "Todos los vehículos han sido encontrados",
      "data": [
          {
              "id": 4,
              "licensePlate": "RR872CU",
              "manufacturingYear": 2022,
              "totalKms": 22000,
              "location": {
                  "id": 4,
                  "locationName": "Centro",
                  "address": "Catamarca 2631",
                  "phoneNumber": "3415231769"
              },
              "color": {
                  "id": 2,
                  "colorName": "Azul oscuro"
              },
              "vehicleModel": {
                  "id": 5,
                  "vehicleModelName": "Cullinan",
                  "transmissionType": "Manual",
                  "passengerCount": 5,
                  "imagePath": "1737728231555-rolls_royce_cullinan.jpg",
                  "category": 2,
                  "brand": {
                      "id": 3,
                      "brandName": "Rolls-Royce"
                  }
              }
          },
          {
              "id": 6,
              "licensePlate": "RRR444",
              "manufacturingYear": 2025,
              "totalKms": 0,
              "location": {
                  "id": 2,
                  "locationName": "Sur",
                  "address": "San Martín 5241",
                  "phoneNumber": "3415476853"
              },
              "color": {
                  "id": 3,
                  "colorName": "Dorado"
              },
              "vehicleModel": {
                  "id": 7,
                  "vehicleModelName": "Phantom",
                  "transmissionType": "Automatica",
                  "passengerCount": 4,
                  "imagePath": "1736960369533-rolls_royce_phantom.jpg",
                  "category": 2,
                  "brand": {
                      "id": 3,
                      "brandName": "Rolls-Royce"
                  }
              }
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

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
