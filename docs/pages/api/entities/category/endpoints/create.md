# POST /api/categories

## Descripción

Este endpoint permite crear una categoría.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- **categoryName**: string, **obligatorio**. Nombre de la categoría.
- **categoryDescription**: string, **obligatorio**. Descripción de la categoría.
- **pricePerDay**: integer, **obligatorio**. Precio por día de la categoría.
- **depositValue**: integer, **obligatorio**. Valor del depósito de la categoría.

### Solicitud de ejemplo

```
POST /api/categories
Cookie: access_token={token};

Content-Type: application/json

{
    "categoryName": "Deportivo Compacto",
    "categoryDescription": "Diseño deportivo, ideal para ciudad",
    "pricePerDay": 250,
    "depositValue": 350
}
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 201 Created

  ```
  {
      "message": "La categoría ha sido registrada exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): depositValue"
      }
      ```

  - Nombre ya utilizado:

    - Respuesta:

      ```
      {
          "message": "Se ha detectado un valor repetido que debería ser único."
      }
      ```

  - Precio por día y/o valor de depósito no numéricos o negativos:

    - Respuesta de ejemplo:

      ```
      {
          "message": "El campo \"depositValue\" debe ser un número positivo"
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

- El campo **categoryName** debe ser único en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
