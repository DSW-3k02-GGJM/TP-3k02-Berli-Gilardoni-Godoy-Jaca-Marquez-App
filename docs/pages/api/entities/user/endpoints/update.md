# PUT /api/users/:id

## Descripción

Este endpoint permite actualizar la información de un usuario, a partir de su identificador.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador del usuario.

#### BODY

- documentType: string, **opcional**. Tipo de documento del usuario.
- documentID: string, **opcional**. Número de documento del usuario.
- userName: string, **opcional**. Nombre del usuario.
- userSurname: string, **opcional**. Apellido del usuario.
- birthDate: string, **opcional**. Fecha de nacimiento del usuario.
- address: string, **opcional**. Dirección del usuario.
- phoneNumber: string, **opcional**. Número de teléfono del usuario.
- nationality: string, **opcional**. Nacionalidad del usuario.
- role: string, **opcional**. Rol del usuario.
- verified: boolean, **opcional**. Indica si el usuario está verificado.

### Solicitud de ejemplo

```
PUT /api/users/2

Content-Type: application/json

{
    "documentType": "DNI",
    "documentID": "44326579",
    "userName": "Pedro",
    "userSurname": "Gomez",
    "birthDate": "2003-09-23",
    "address": "Corrientes 1637",
    "phoneNumber": "3417645380",
    "nationality": "Argentina"
}
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "El usuario ha sido actualizado exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Número de documento ya utilizado:

    - Respuesta:

      ```
      {
          "message": "Se ha detectado un valor repetido que debería ser único."
      }
      ```

  - Formato incorrecto para la fecha de nacimiento:

    - Respuesta:

      ```
      {
          "message": "El campo \"birthDate\" debe ser una fecha válida"
      }
      ```

  - Rol fuera de los valores posibles:

    - Respuesta:

      ```
      {
          "message": "El rol no existe. Los roles válidos son: admin, employee, client"
      }
      ```

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

## Consideraciones

- El campo **documentID** debe ser único en el sistema.
