# GET /api/brands/brand-name-exists/:brandName/:id

## Descripción

Este endpoint permite verificar si un nombre se encuentra disponible antes de crear o modificar una marca.

Se devolverá `true` si el nombre de la marca ya está en uso y el `id` de la marca con ese nombre no coincide con el `id` pasado por parámetro. De lo contrario, se devolverá `false`.

## Solicitud

### Parámetros para la solicitud

#### URL

- brandName: string, **obligatorio**. Nombre de la marca.

- id: integer, **obligatorio**. Identificador de la marca.
  - Utilizar -1 en el caso de la creación de una marca.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/brands/brand-name-exists/Ford/-1
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- exists: boolean. Indica si el nombre de la marca se encuentra en uso.

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

## Consideraciones

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
