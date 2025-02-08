# GET /api/reservations

## Descripción

Este endpoint permite encontrar la información de todas las reservas.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/reservations
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
  - user: object. Objeto que representa el usuario asociado a la reserva.

  > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Usuario](../../user/main/main.md).

  - vehicle: object. Objeto que representa el vehículo asociado a la reserva.

  > 💡 **Sugerencia:** Para más información, consultá la documentación de la entidad [Vehículo](../../vehicle/main/main.md).

  > ⚠️ Nota: El vehículo contendrá a su vez un [Modelo](../../vehicle-model/main/main.md), y, este último, una [Categoría](../../category/main/main.md).

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "Todas las reservas han sido encontradas",
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
              "user": {
                  "id": 3,
                  "documentType": "Pasaporte",
                  "documentID": "AM658329",
                  "userName": "Javier",
                  "userSurname": "Gimenez",
                  "birthDate": "2001-05-17",
                  "address": "Paraguay 391",
                  "phoneNumber": "3415436572",
                  "nationality": "Colombia",
                  "email": "javiergimenez@gmail.com",
                  "password": "$2b$10$cIGhPLw0KtQb4iZh0VNKt.6diPp5aQ2XVvhz4nEXpH24CZecmEuWC",
                  "role": "client",
                  "verified": true
              },
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
                      "brand": 3
                  }
              }
          },
          {
              "id": 4,
              "reservationDate": "2025-01-24",
              "startDate": "2025-01-25",
              "plannedEndDate": "2025-02-01",
              "realEndDate": null,
              "cancellationDate": null,
              "initialKms": null,
              "finalKms": null,
              "finalPrice": null,
              "user": {
                  "id": 2,
                  "documentType": "DNI",
                  "documentID": "44326579",
                  "userName": "Pedro",
                  "userSurname": "Gomez",
                  "birthDate": "2003-09-23",
                  "address": "Italia 482",
                  "phoneNumber": "3415768435",
                  "nationality": "Argentina",
                  "email": "pedrogomez@gmail.com",
                  "password": "$2b$10$645h3cEGKW.KeqQeIC1br.sgyb4FNF3M4C85exAM3m.lDGYFFFNg2",
                  "role": "client",
                  "verified": true
              },
              "vehicle": {
                  "id": 3,
                  "licensePlate": "FR437PF",
                  "manufacturingYear": 2023,
                  "totalKms": 17000,
                  "location": 3,
                  "color": 1,
                  "vehicleModel": {
                      "id": 4,
                      "vehicleModelName": "Portofino",
                      "transmissionType": "Manual",
                      "passengerCount": 4,
                      "imagePath": "1735160609442-ferrari_portofino.jpg",
                      "category": {
                          "id": 1,
                          "categoryName": "Deportivo Compacto",
                          "categoryDescription": "Diseño deportivo, ideal para ciudad",
                          "pricePerDay": 250,
                          "depositValue": 350
                      },
                      "brand": 2
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

- El usuario autenticado debe ser un administrador (rol **'admin'**) o un empleado (rol **'employee'**) para poder utilizar este endpoint.
