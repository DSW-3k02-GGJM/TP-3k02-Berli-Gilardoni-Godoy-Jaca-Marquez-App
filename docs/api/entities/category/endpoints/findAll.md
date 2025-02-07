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

---
## Respuesta
### Parámetros de respuesta
* message: string. Describe el estado de la solicitud.
* data: array. Arreglo que contiene las categorías encontradas en forma de objetos.

    Sus atributos son:
  * id: integer. Identificador de la categoría.
  * categoryName: string. Nombre de la categoría.
  * categoryDescription: string. Breve descripción de la categoría.
  * pricePerDay: integer. Precio por día.
  * depositValue: integer. Valor del depósito.

### Respuesta exitosa de ejemplo
* #### 200 OK
```
{
  "message": "Todas las categorías han sido encontradas",
  "data": [
    {
      "id": 1,
      "categoryName": "SUV",
      "categoryDescription": "Vehículos grandes familiares",
      "pricePerDay": 100,
      "depositValue": 250
    },
    {
      "id": 2,
      "categoryName": "Todoterreno",
      "categoryDescription": "Vehiculos con tracción en las cuatro ruedas, usualmente utilizan diesel",
      "pricePerDay": 125,
      "depositValue": 250
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
