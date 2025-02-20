# POST /api/users/send-password-reset/:email

## Descripción

Este endpoint permite enviar un correo electrónico para restablecer la contraseña del usuario asociado al mismo.

## Solicitud

### Parámetros para la solicitud

#### URL

- email: string, **obligatorio**. Email del usuario.

### Solicitud de ejemplo

```
 POST /api/users/send-password-reset/nicolasgimenez@gmail.com
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Solicitud exitosa"
  }
  ```

## Errores

- #### 404 Not Found

  - Recurso no encontrado:

    - Respuesta:

      ```
      {
          "message": "El email no pertenece a una cuenta registrada"
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

- Se genera un token único de restablecimiento de contraseña que le permitirá al usuario modificar la propia a través de un enlace que le llegará a su correo electrónico.

- El token generado tiene las siguientes características principales:

  - Duración: 10 minutos.

    - Si el usuario no utiliza el enlace dentro de este tiempo, deberá solicitar uno nuevo.

  - Uso único: Es válido solo para un restablecimiento y no puede reutilizarse.

  - Seguridad: No se almacena en cookies ni en el cliente; solo se envía al correo y se valida en el servidor.
