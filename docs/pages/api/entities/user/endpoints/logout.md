# POST /api/users/logout

## Descripción

Este endpoint permite que un usuario cierre su sesión en el sistema.

En consecuencia, se elimina la cookie **'access_token'** con el token de autenticación asociada al usuario.

## Solicitud

### Parámetros para la solicitud

No es necesario utilizar ningún parámetro para realizar la solicitud.

### Solicitud de ejemplo

```
POST /api/users/logout
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Cierre de sesión exitoso"
  }
  ```
