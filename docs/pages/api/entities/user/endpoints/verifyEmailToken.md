# POST /api/users/verify-email-token/:token

## Descripción

Este endpoint permite verificar la cuenta de un usuario.

Valida que el token proporcionado sea correcto.

- Es indispensable que el mismo haya sido recibido a través de un enlace en el correo electrónico del usuario, que, al hacer click en el mismo, desencadenará la solicitud a este endpoint.

## Solicitud

### Parámetros para la solicitud

#### URL

- token: string, **obligatorio**. Token de verificación de la cuenta del usuario.

### Solicitud de ejemplo

```
POST /api/users/verify-email-token/{token}
```

**Nota:** {token} se reemplazará por un Token JWT válido, que estará incluído en el enlace que reciba el usuario en su correo electrónico.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Su cuenta ha sido verificada"
  }
  ```

## Errores

- #### 401 Unauthorized

  - La cuenta del usuario ya se encuentra verificada:

    - Respuesta:

      ```
      {
          "message": "Su cuenta ya se encuentra verificada"
      }
      ```

  - Error al verificar la cuenta del usuario:

    - Respuesta:

      ```
      {
          "message": "No se ha podido verificar la cuenta"
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
