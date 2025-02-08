# GET /api/users/:id

## Descripción

Este endpoint permite encontrar la información de un usuario, a partir de su identificador.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador del usuario.

### Solicitud de ejemplo

```
GET /api/users/2
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: object. Objeto que representa el usuario encontrado.

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
    "message": "El usuario ha sido encontrado",
    "data": {
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
    }
  }
  ```

## Errores

- #### 404 Not Found

  - Recurso no encontrado:

    - Respuesta:

      ```
      {
          "message": "Usuario no encontrado"
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
