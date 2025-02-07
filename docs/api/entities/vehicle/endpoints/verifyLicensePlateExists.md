# GET /api/vehicles/license-plate-exists/:licensePlate/:id

## Descripción

Este endpoint permite verificar si una patente se encuentra disponible antes de crear o modificar un vehículo.

Se devolverá `true` si la patente ya está en uso y el `id` del vehículo con ese nombre no coincide con el `id` pasado por parámetro. De lo contrario, se devolverá `false`.

## Solicitud

### Parámetros para la solicitud

#### URL

- licensePlate: string, **obligatorio**. Patente a verificar.

- id: integer, **obligatorio**. Identificador del vehículo.
  - Utilizar -1 en el caso de la creación de un vehículo.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/vehicles/license-plate-exists/GNN430/-1
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- exists: boolean. Indica si la patente se encuentra en uso.

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
