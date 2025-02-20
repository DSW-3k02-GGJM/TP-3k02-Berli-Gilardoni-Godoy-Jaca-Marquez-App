# GET /api/users

## Descripción

Este endpoint permite encontrar la información de todos los usuarios.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/users
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene los usuarios encontrados en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador del usuario.
  - documentType: string. Tipo de documento del usuario.
  - documentID: string. Número de documento del usuario.
  - userName: string. Nombre del usuario.
  - userSurname: string. Apellido del usuario.
  - birthDate: string. Fecha de nacimiento del usuario.
  - address: string. Dirección del usuario.
  - phoneNumber: string. Número de teléfono del usuario.
  - nationality: string. Nacionalidad del usuario.
  - email: string. Email del usuario.
  - password: string. Contraseña encriptada del usuario.
  - role: string. Rol del usuario.
  - verified: boolean. Indica si el usuario está verificado.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
    "message": "Todos los usuarios han sido encontrados",
    "data": [
      {
        "id": 1,
        "documentType": "DNI",
        "documentID": "12345678",
        "userName": "Admin",
        "userSurname": "Admin",
        "birthDate": "1995-02-07",
        "address": "Admin 123",
        "phoneNumber": "3419876543",
        "nationality": "Argentina",
        "email": "admin@admin.com",
        "password": "$2b$10$5BHEjTQWWXDXq/BMcKuHD.7F99Egnd6X1o0uIkUyUPX/mWcF5KHYS",
        "role": "admin",
        "verified": true
      },
      {
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
        "role": "employee",
        "verified": true
      },
      {
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
