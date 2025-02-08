# POST /api/users/verify-password-reset-token/:token

## Descripción

Este endpoint permite restablecer la contraseña de un usuario.

Valida que el token proporcionado sea correcto.

- Es indispensable que el mismo haya sido recibido a través de un enlace en el correo electrónico del usuario, que, al hacer click en el mismo, tendrá la posibilidad de elegir una nueva contraseña para su cuenta.

Antes de guardarla, lleva a cabo la encriptación de la contraseña.

## Solicitud

### Parámetros para la solicitud

#### URL

- token: string, **obligatorio**. Token de restablecimiento de la contraseña del usuario.

#### BODY

- newPassword: string, **obligatorio**. Nueva contraseña elegida por el usuario.
- confirmPassword: string, **obligatorio**. Confirmación de la nueva contraseña.

### Solicitud de ejemplo

```
POST /api/users/verify-password-reset-token/{token}

Content-Type: application/json

{
    "newPassword": "02468",
    "confirmPassword": "02468"
}
```

**Nota:** {token} se reemplazará por un Token JWT válido, que estará incluído en el enlace que reciba el usuario en su correo electrónico.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Contraseña restablecida exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): confirmPassword"
      }
      ```

  - Las contraseñas proporcionadas no coinciden entre sí:

    - Respuesta:

      ```
      {
          message: `Las contraseñas deben coincidir.`,
      }
      ```

- #### 401 Unauthorized

  - Error al restablecer la contraseña:

    - Respuesta:

      ```
      {
          "message": "No se ha podido restablecer la contraseña"
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
