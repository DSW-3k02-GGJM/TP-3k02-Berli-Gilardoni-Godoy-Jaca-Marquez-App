# POST /api/brands

## Descripción

Este endpoint permite crear una marca.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- **brandName**: string, **obligatorio**. Nombre de la marca.

### Solicitud de ejemplo

```
POST /api/brands
Cookie: access_token={token};

Content-Type: application/json

{
    "brandName": "Ford"
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
      "message": "La marca ha sido registrada exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): brandName"
      }
      ```

  - Nombre ya utilizado:

    - Respuesta:

      ```
      {
          "message": "Se ha detectado un valor repetido que debería ser único."
      }
      ```

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

- El campo **brandName** debe ser único en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
