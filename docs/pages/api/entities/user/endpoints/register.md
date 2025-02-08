# POST /api/users/register

## Descripción

Este endpoint permite registrar un usuario.

Antes de guardarla, lleva a cabo la encriptación de la contraseña.

Desencadena la verificación de la cuenta a través del correo electrónico para poder completar el registro.

## Solicitud

### Parámetros para la solicitud

#### BODY

- documentType: string, **obligatorio**. Tipo de documento del usuario.
- documentID: string, **obligatorio**. Número de documento del usuario.
- userName: string, **obligatorio**. Nombre del usuario.
- userSurname: string, **obligatorio**. Apellido del usuario.
- birthDate: string, **obligatorio**. Fecha de nacimiento del usuario.
- address: string, **obligatorio**. Dirección del usuario.
- phoneNumber: string, **obligatorio**. Número de teléfono del usuario.
- nationality: string, **obligatorio**. Nacionalidad del usuario.
- email: string, **obligatorio**. Email del usuario.
- password: string, **obligatorio**. Contraseña del usuario.

### Solicitud de ejemplo

```
POST /api/users/register

Content-Type: application/json

{
    "documentType": "DNI",
    "documentID": "43769142",
    "userName": "Nicolás",
    "userSurname": "Gimenez",
    "birthDate": "2002-04-30",
    "address": "Balcarce 1384",
    "phoneNumber": "3415437859",
    "nationality": "Argentina",
    "email": "nicolasgimenez@gmail.com",
    "password": "654321"
}
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Registro exitoso"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): nationality"
      }
      ```

  - Número de documento y/o email ya utilizados:

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

  - Formato incorrecto para el email:

    - Respuesta:

      ```
      {
          "message": "El campo \"email\" debe ser una dirección de correo electrónico válida"
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

- Los campos **email** y **documentID** deben ser únicos en el sistema.

- Al nuevo usuario se le asigna automáticamente el rol **'client'** y se marca como **false** el campo que indica si se encuentra verificado, hasta que se complete la verificación de la cuenta a través del correo electrónico.
