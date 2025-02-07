# GET /api/vehicles/available?startDate=:startDate&endDate=:endDate&location=:location

## Descripción
Este endpoint permite encontrar la información de todos los vehículos disponibles en una sucursal para un rango de fechas.

## Solicitud

### Parámetros para la solicitud

#### URL

- startDate: date, **obligatorio**. Fecha de inicio de la reserva.
- endDate: date, **obligatorio**. Fecha de finalización de la reserva.
- location: integer, **obligatorio**. Identificador de la sucursal en la que se realizará la reserva.

### Solicitud de ejemplo

```
GET /api/vehicles/available?startDate=2025-02-08&endDate=2025-02-15&location=4
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene los vehículos encontrados en forma de objetos.

  Sus atributos son:

    - id: integer. Identificador del vehículo.
    - licensePlate: string. Patente del vehículo.
    - manufacturingYear: integer. Año de fabricación del vehículo.
    - totalKms: integer. Kilometraje total del vehículo.
    - location: object. Objeto que representa la sucursal a la que corresponde el vehículo. Para más información referirse a la documentación de la entidad [Sucursal](../../location/main/main.md).
    - color: integer. Identificador del color del vehículo.
    - vehicleModel: object. Objeto que representa el modelo del vehículo. Para más información referirse a la documentación de la entidad [Modelo](../../vehicle-model/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
    "message":"Todos los vehículos disponibles han sido encontrados",
    "data":[
        {
            "id":31,
            "licensePlate":"MB451AG",
            "manufacturingYear":2023,
            "totalKms":19510,
            "location":{
                "id":4,
                "locationName":"Centro",
                "address":"Catamarca 2631",
                "phoneNumber":"3415231769"
            },
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
        },
        {
            "id":34,
            "licensePlate":"RR372PH",
            "manufacturingYear":2024,
            "totalKms":10000,
            "location":{
                "id":4, 
                "locationName":"Centro",
                "address":"Catamarca 2631",
                "phoneNumber":"3415231769"
            },
            "color":12,
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
    ]
  }
    ```

## Errores

- #### 500 Internal Server Error

    - Error de conexión con el servidor:

        - Respuesta:

          ```
          {
              "message": "Error de conexión"
          }
          ```