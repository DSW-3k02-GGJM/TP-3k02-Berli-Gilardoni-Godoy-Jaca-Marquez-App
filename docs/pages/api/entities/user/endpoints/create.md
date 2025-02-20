# POST /api/users

## Descripción

Este endpoint permite crear un usuario.

Antes de guardarla, lleva a cabo la encriptación de la contraseña.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

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
- role: string, **obligatorio**. Rol del usuario.
- verified: boolean, **obligatorio**. Indica si el usuario está verificado.

### Solicitud de ejemplo

```
POST /api/users
Cookie: access_token={token};

Content-Type: application/json

{
    "documentType": "DNI",
    "documentID": "44326579",
    "userName": "Pedro",
    "userSurname": "Gomez",
    "birthDate": "2003-09-23",
    "address": "Italia 482",
    "phoneNumber": "3415768435",
    "nationality": "Argentina",
    "email": "pedrogomez@gmail.com",
    "password": "123456",
    "role": "employee",
    "verified": true
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 201 Created

  ```
  {
      "message": "El usuario ha sido registrado exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): userSurname, phoneNumber"
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

  - Rol fuera de los valores posibles:

    - Respuesta:

      ```
      {
          "message": "El rol no existe. Los roles válidos son: admin, employee, client"
      }
      ```

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

- Los campos **email** y **documentID** deben ser únicos en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
