# GET /api/users/document-id-exists/:documentID/:id

## Descripción

Este endpoint permite verificar si un número de documento se encuentra disponible antes de crear o modificar un usuario.

Se devolverá `true` si el número de documento ya está en uso y el `id` del usuario con ese número de documento no coincide con el `id` pasado por parámetro. De lo contrario, se devolverá `false`.

## Solicitud

### Parámetros de solicitud

#### URL

- documentID: string, **obligatorio**. Número de documento del usuario.

- id: integer, **obligatorio**. Identificador del usuario.
  - Utilizar -1 en el caso de la creación de un usuario.

### Solicitud de ejemplo

```
GET /api/user/document-id-exists/44326579/-1
```

## Respuesta

### Parámetros de respuesta

- exists: boolean. Indica si el número de documento se encuentra en uso.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "exists": true
  }
  ```
