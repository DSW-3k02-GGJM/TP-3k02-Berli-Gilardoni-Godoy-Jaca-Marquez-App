# GET  api/reservations/user-reservations

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
    - reservationDate: date. Fecha en la que se registró la reserva.
    - startDate: date. Fecha de inicio de la reserva.
    - plannedEndDate: date. Fecha de fin planificada de la reserva.
    - realEndDate: date. Fecha de fin real de la reserva.
    - cancellationDate: date. Fecha de cancelación de la reserva.
    - initialKms: integer. Kilometraje inicial del vehículo.
    - finalKms: integer. Kilometraje final del vehículo.
    - finalPrice: integer. Precio final de la reserva.
    - user: object. Objeto que representa el usuario asociado a la reserva. Para más información referirse a la documentación de la entidad [Usuario](../../user/main/main.md).
    - vehicle: object. Objeto que representa el vehículo asociado a la reserva. Para más información referirse a la documentación de la entidad [Vehículo](../../vehicle/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
    "message":"Todas sus reservas han sido encontradas",
    "data":[
        {
            "id":319,
            "reservationDate":"2025-02-07",
            "startDate":"2025-02-08",
            "plannedEndDate":"2025-02-15",
            "realEndDate":null,
            "cancellationDate":null,
            "initialKms":null,
            "finalKms":null,
            "finalPrice":null,"user":79,
            "vehicle":{
                "id":46,
                "licensePlate":"RRR444",
                "manufacturingYear":2015,
                "totalKms":0,
                "location":16,
                "color":36,
                "vehicleModel":{
                    "id":43,
                    "vehicleModelName":"Phantom",
                    "transmissionType":"Automatica",
                    "passengerCount":4,
                    "imagePath":"1736960369533-rolls_royce_phantom.jpg",
                    "category":{
                        "id":12,
                        "categoryName":"Automóvil de Alta Gama",
                        "categoryDescription":"Un lujo para los más ambiciosos",
                        "pricePerDay":380,
                        "depositValue":460
                    },
                    "brand":{
                        "id":39,
                        "brandName":"Rolls-Royce"
                    }
                }
            }
        },
        {
            "id":320,
            "reservationDate":"2025-02-07",
            "startDate":"2025-02-08",
            "plannedEndDate":"2025-02-15",
            "realEndDate":null,
            "cancellationDate":null,
            "initialKms":null,
            "finalKms":null,
            "finalPrice":null,
            "user":79,
            "vehicle":{
                "id":31,
                "licensePlate":"MB451AG",
                "manufacturingYear":2023,
                "totalKms":19500,
                "location":4,
                "color":22,
                "vehicleModel":{
                    "id":41,
                    "vehicleModelName":"AMG GT",
                    "transmissionType":"Manual",
                    "passengerCount":5,
                    "imagePath":"1736950741741-mercedes_benz_amg_gt.jpg",
                    "category":{
                        "id":9,
                        "categoryName":"Deportivo",
                        "categoryDescription":"Diseño deportivo, ideal para ciudad",
                        "pricePerDay":250,
                        "depositValue":350
                    },
                    "brand":{
                        "id":34,
                    "brandName":"Mercedes-Benz"
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
