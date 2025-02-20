# POST /api/users/send-email-verification/:email

## Descripción

Este endpoint permite enviar un correo electrónico para verificar la cuenta del usuario asociada al mismo.

## Solicitud

### Parámetros para la solicitud

#### URL

- email: string, **obligatorio**. Email del usuario.

### Solicitud de ejemplo

```
POST /api/users/send-email-verification/nicolasgimenez@gmail.com
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Se ha enviado un email de verificación a tu correo"
  }
  ```

## Errores

- #### 401 Unauthorized

  - Error al enviar el correo electrónico de verificación:

    - Respuesta:

      ```
      {
          message: 'No se ha podido enviar el email de verificación'
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

## Consideraciones

- Se genera un token único de verificación de cuenta que le permitirá al usuario verificar la propia a través de un enlace que le llegará a su correo electrónico.

- El token generado tiene las siguientes características principales:

  - Duración: 10 minutos.

    - Si el usuario no utiliza el enlace dentro de este tiempo, deberá solicitar uno nuevo.

  - Uso único: Es válido solo para una verificación y no puede reutilizarse.

  - Seguridad: No se almacena en cookies ni en el cliente; solo se envía al correo y se valida en el servidor.
