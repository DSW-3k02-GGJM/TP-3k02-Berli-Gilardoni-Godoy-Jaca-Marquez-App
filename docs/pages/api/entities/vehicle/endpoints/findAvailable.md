# GET /api/vehicles/available?startDate={startDate}&endDate={endDate}&location={location}

## Descripción

Este endpoint permite encontrar la información de todos los vehículos disponibles en una sucursal para un rango de fechas, al momento de realizar una reserva.

## Solicitud

### Parámetros para la solicitud

#### URL

- startDate: date, **obligatorio**. Fecha de inicio de la reserva.
- endDate: date, **obligatorio**. Fecha de fin de la reserva.
- location: integer, **obligatorio**. Identificador de la sucursal en la que se realizará la reserva.

### Solicitud de ejemplo

```
GET /api/vehicles/available?startDate=2025-02-08&endDate=2025-02-15&location=4
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene los vehículos disponibles encontrados en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador del vehículo.
  - licensePlate: string. Patente del vehículo.
  - manufacturingYear: integer. Año de fabricación del vehículo.
  - totalKms: integer. Kilometraje total del vehículo.
  - location: object. Objeto que representa la sucursal a la que corresponde el vehículo.

    > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Sucursal](../../location/main/main.md).

  - color: integer. Identificador del color del vehículo.
  - vehicleModel: object. Objeto que representa el modelo del vehículo.

    > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Modelo](../../vehicle-model/main/main.md).

    > ⚠️ **Nota**: El modelo contendrá a su vez una [Categoría](../../category/main/main.md) y una [Marca](../../brand/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "Todos los vehículos disponibles han sido encontrados",
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
          },
          {
              "id": 7,
              "licensePlate": "RR372PH",
              "manufacturingYear": 2024,
              "totalKms": 10000,
              "location": {
                  "id": 4,
                  "locationName": "Centro",
                  "address": "Catamarca 2631",
                  "phoneNumber": "3415231769"
              },
              "color": 3,
              "vehicleModel":{
                  "id": 6,
                  "vehicleModelName": "Phantom",
                  "transmissionType": "Automatica",
                  "passengerCount": 4,
                  "imagePath": "1736960369533-rolls_royce_phantom.jpg",
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
      ]
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en la URL de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): endDate"
      }
      ```

  - Identificador de la sucursal no numérico o negativo:

    - Respuesta:

      ```
      {
          "message": "El campo \"location\" debe ser un número positivo"
      }
      ```

  - Formato incorrecto para la fecha de inicio y/o fecha de fin de la reserva:

    - Respuesta de ejemplo:

      ```
      {
          "message": "El campo \"endDate\" debe ser una fecha válida"
      }
      ```

  - Rango de fechas inválido:

    - Respuesta de ejemplo:

      ```
      {
          "message": "La fecha de inicio debe ser mayor o igual a hoy"
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

- El arreglo de vehículos disponibles estará compuesto por un único vehículo por modelo.

  - Es decir, que si para la sucursal y el rango de fechas indicado existe más de un vehículo disponible de un mismo modelo, en el arreglo se encontrará uno solo de ellos (el primero que sea encontrado).
