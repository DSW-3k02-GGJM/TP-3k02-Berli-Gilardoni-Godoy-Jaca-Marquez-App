# GET /api/reservations/user-reservations

## Descripción

Este endpoint permite encontrar la información de todas las reservas de un usuario.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/reservations/user-reservations
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene las reservas encontradas en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador de la reserva.
  - reservationDate: date. Fecha de registro de la reserva.
  - startDate: date. Fecha de inicio de la reserva.
  - plannedEndDate: date. Fecha de fin planeada de la reserva.
  - realEndDate: date. Fecha de fin real de la reserva.
  - cancellationDate: date. Fecha de cancelación de la reserva.
  - initialKms: integer. Kilometraje inicial del vehículo.
  - finalKms: integer. Kilometraje final del vehículo.
  - finalPrice: integer. Precio final de la reserva.
  - vehicle: object. Objeto que representa el vehículo asociado a la reserva.

    > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Vehículo](../../vehicle/main/main.md).

    > ⚠️ **Nota**: El vehículo contendrá a su vez un [Modelo](../../vehicle-model/main/main.md), y, este último, una [Categoría](../../category/main/main.md) y una [Marca](../../brand/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
    "message": "Todas sus reservas han sido encontradas",
    "data": [
        {
            "id": 2,
            "reservationDate": "2025-01-23",
            "startDate": "2025-01-24",
            "plannedEndDate": "2025-01-31",
            "realEndDate": "2025-01-24",
            "cancellationDate": null,
            "initialKms": 20500,
            "finalKms": 22000,
            "finalPrice": 2660,
            "user": 3,
            "vehicle": {
                "id": 4,
                "licensePlate": "RR872CU",
                "manufacturingYear": 2022,
                "totalKms": 22000,
                "location": 4,
                "color": 2,
                "vehicleModel": {
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

- El usuario autenticado debe ser un cliente (rol **'client'**) para poder utilizar este endpoint.
