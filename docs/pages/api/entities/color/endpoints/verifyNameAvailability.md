# GET /api/colors/color-name-exists/:colorName/:id

## Descripción

Este endpoint permite verificar si un nombre se encuentra disponible antes de crear o modificar un color.

Se devolverá `true` si el nombre del color ya está en uso y el `id` del color con ese nombre no coincide con el `id` pasado por parámetro. De lo contrario, se devolverá `false`.

## Solicitud

### Parámetros para la solicitud

#### URL

- colorName: string, **obligatorio**. Nombre del color.

- id: integer, **obligatorio**. Identificador del color.
  - Utilizar -1 en el caso de la creación de un color.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/color/color-name-exists/Azul oscuro/-1
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- exists: boolean. Indica si el nombre del color se encuentra en uso.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "exists": true
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

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
