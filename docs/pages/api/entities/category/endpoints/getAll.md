# GET /api/categories

## Descripción

Este endpoint permite encontrar la información de todas las categorías.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/categories
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.
- data: array. Arreglo que contiene las categorías encontradas en forma de objetos.

  Sus atributos son:

  - id: integer. Identificador de la categoría.
  - categoryName: string. Nombre de la categoría.
  - categoryDescription: string. Descripción de la categoría.
  - pricePerDay: integer. Precio por día de la categoría.
  - depositValue: integer. Valor del depósito de la categoría.

### Respuesta exitosa de ejemplo

- #### 200 OK

  ```
  {
      "message": "Todas las categorías han sido encontradas",
      "data": [
          {
              "id": 1,
              "categoryName": "Deportivo Compacto",
              "categoryDescription": "Diseño deportivo, ideal para ciudad",
              "pricePerDay": 250,
              "depositValue": 350
          },
          {
            "id": 2,
            "categoryName": "Automóvil de Alta Gama",
            "categoryDescription": "Un lujo para los más ambiciosos",
            "pricePerDay": 380,
            "depositValue": 460
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
