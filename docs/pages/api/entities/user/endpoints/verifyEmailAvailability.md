# GET /api/users/email-exists/:email

## Descripción

Este endpoint permite verificar si un email se encuentra disponible crear o modificar un usuario.

## Solicitud

### Parámetros para la solicitud

#### URL

- email: string, **obligatorio**. Email del usuario.

### Solicitud de ejemplo

```
GET /api/users/email-exists/pedrogomez@gmail.com
```

## Respuesta

### Parámetros de respuesta

- exists: boolean. Indica si el email se encuentra en uso.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "exists": true
  }
  ```
