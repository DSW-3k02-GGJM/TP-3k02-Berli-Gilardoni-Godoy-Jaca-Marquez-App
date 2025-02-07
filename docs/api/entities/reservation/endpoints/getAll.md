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
     "message": "Todas las reservas han sido encontradas",
  "data": [
    {
      "id": 301,
      "reservationDate": "2025-01-23",
      "startDate": "2025-01-24",
      "plannedEndDate": "2025-01-31",
      "realEndDate": "2025-01-24",
      "cancellationDate": null,
      "initialKms": 20500,
      "finalKms": 22000,
      "finalPrice": 2660,
      "user": {
        "id": 69,
        "documentType": "DNI",
        "documentID": "42436587",
        "userName": "Pedro",
        "userSurname": "Gomez",
        "birthDate": "2003-09-13",
        "address": "Rioja 836",
        "phoneNumber": "3417465982",
        "nationality": "Argentina",
        "email": "pedrogomez@gmail.com",
        "password": "$2b$10$njeoamGQFZRV7v9pnzETY.c70JQNCp/aAof6X9byhUVIvHzmyM5JW",
        "role": "client",
        "verified": true
      },
      "vehicle": {
        "id": 44,
        "licensePlate": "RR872CU",
        "manufacturingYear": 2022,
        "totalKms": 22000,
        "location": 16,
        "color": 36,
        "vehicleModel": {
          "id": 49,
          "vehicleModelName": "Cullinan",
          "transmissionType": "Manual",
          "passengerCount": 5,
          "imagePath": "1737728231555-rolls_royce_cullinan.jpg",
          "category": {
            "id": 12,
            "categoryName": "Automóvil de Alta Gama",
            "categoryDescription": "Un lujo para los más ambiciosos",
            "pricePerDay": 380,
            "depositValue": 460
          },
          "brand": 39
        }
      }
    }, 
    {
      "id": 317,
      "reservationDate": "2025-01-24",
      "startDate": "2025-01-25",
      "plannedEndDate": "2025-02-01",
      "realEndDate": null,
      "cancellationDate": null,
      "initialKms": null,
      "finalKms": null,
      "finalPrice": null,
      "user": {
        "id": 69,
        "documentType": "DNI",
        "documentID": "42436587",
        "userName": "Pedro",
        "userSurname": "Gomez",
        "birthDate": "2003-09-13",
        "address": "Rioja 836",
        "phoneNumber": "3417465982",
        "nationality": "Argentina",
        "email": "pedrogomez@gmail.com",
        "password": "$2b$10$njeoamGQFZRV7v9pnzETY.c70JQNCp/aAof6X9byhUVIvHzmyM5JW",
        "role": "client",
        "verified": true
      },
      "vehicle": {
        "id": 19,
        "licensePlate": "FR437PF",
        "manufacturingYear": 2023,
        "totalKms": 17000,
        "location": 5,
        "color": 12,
        "vehicleModel": {
          "id": 12,
          "vehicleModelName": "Portofino",
          "transmissionType": "Manual",
          "passengerCount": 4,
          "imagePath": "1735160609442-ferrari_portofino.jpg",
          "category": {
            "id": 9,
            "categoryName": "Deportivo",
            "categoryDescription": "Diseño deportivo, ideal para ciudad",
            "pricePerDay": 250,
            "depositValue": 350
          },
          "brand": 18
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

- El usuario autenticado debe ser un administrador (rol **'admin'**) o empleado (rol **'employee'**) para poder utilizar este endpoint.
