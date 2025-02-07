# PUT /api/brands/:id

## Descripción
Este endpoint permite actualizar la informacíon de una categoría, a partir de su identificador. 

## Solicitud
### Parámetros para la solicitud
#### URL
* id: integer, **obligatorio**. Identificador de la marca.

#### COOKIES
* access_token: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  * Este token debe ser enviado como una cookie en la solicitud.

#### BODY
* categoryName: string. Nombre de la categoría.
* categoryDescription: string. Breve descripción de la categoría.
* pricePerDay: integer. Precio por día.
* depositValue: integer. Valor del depósito

### Solicitud de ejemplo
```
PUT /api/categories/2
Cookie: access_token={token};

Content-Type: application/json

{
"categoryName":"Deportivo",
"categoryDescription":"Diseño deportivo, ideal para ciudad",
"pricePerDay":250,
"depositValue":350
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.


## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta exitosa
```
{
    "message":"La categoría ha sido actualizada exitosamente"
}
```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:
    - Respuesta: 
        ```
        {
            "message": "Toda la información es requerida. Falta(n): categoryName"
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

- #### 404 Not Found

    - Recurso no encontrado:

        - Respuesta:

          ```
          {
              "message": "Categoría no encontrada"
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

- El campo **categoryName** debe ser único en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.