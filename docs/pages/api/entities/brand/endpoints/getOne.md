# GET /api/brands/:id

## Descripción

Este endpoint permite encontrar la información de una marca, a partir de su identificador.

## Solicitud

### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador de la marca.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/brands/2
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: object. Objeto que representa la marca encontrada.

  Sus atributos son:

  - id: integer. Identificador de la marca.
  - brandName: string. Nombre de la marca.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "La marca ha sido encontrada",
      "data": {
          "id": 2,
          "brandName": "Chevrolet"
      }
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

- #### 404 Not Found

  - Recurso no encontrado:

    - Respuesta:

      ```
      {
          "message": "Marca no encontrada"
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
