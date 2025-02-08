# POST /api/users/is-authenticated

## Descripción

Este endpoint permite determinar si existe un usuario autenticado en el sistema.

Para hacerlo, verifica si existe un token almacenado en la cookie **'access_token'** del lado del servidor, y, si es así, valida que el mismo corresponda a un usuario del sistema, y que no haya expirado.

## Solicitud

### Parámetros para la solicitud

No es necesario utilizar ningún parámetro para realizar la solicitud.

### Solicitud de ejemplo

```
POST /api/users/is-authenticated
```

## Respuesta

### Parámetros de respuesta

- authenticated: boolean. Indica si hay un usuario autenticado en el sistema.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "authenticated": true
  }
  ```
