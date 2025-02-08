# POST /api/users/send-email/:email

## Descripción

Este endpoint permite enviar un correo electrónico personalizado a un usuario.

## Solicitud

### Parámetros para la solicitud

#### URL

- email: string, **obligatorio**. Email del usuario.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- subject: string, **obligatorio**. Asunto del correo electrónico.
- message: string, **obligatorio**. Cuerpo del correo electrónico.

### Solicitud de ejemplo

```
POST /api/users/send-email/nicolasgimenez@gmail.com
Cookie: access_token={token};

Content-Type: application/json

{
    "subject": "Alquilcar Reservas",
    "message": "Le escribimos para agradecerle por confiar en nuestro servicio 🚗"
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Email enviado"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): subject"
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

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) o un empleado (rol **'employee'**) para poder utilizar este endpoint.
