# GET /api/brands

## Descripción

Este endpoint permite encontrar la información de todas las marcas.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/brands
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene las marcas encontradas en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador de la marca.
  - brandName: string. Nombre de la marca.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "Todas las marcas han sido encontradas",
      "data": [
          {
            "id": 2,
            "brandName": "Chevrolet"
          },
          {
            "id": 3,
            "brandName": "Ford"
          },
          {
            "id": 1,
            "brandName": "Toyota"
          }
      ]
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
