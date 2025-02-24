# POST /api/vehicle-models

## Descripción

Este endpoint permite crear un modelo.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- vehicleModelName: string, **obligatorio**. Nombre del modelo.
- transmissionType: string, **obligatorio**. Tipo de transmisión de los vehículos del modelo.
- passengerCount: integer, **obligatorio**. Cantidad de pasajeros que pueden transportar los vehículos del modelo.
- imagePath: string, **obligatorio**. Ruta de la imagen representativa del modelo.
- category: integer, **obligatorio**. Identificador de la categoría del modelo.
- brand: integer, **obligatorio**. Identificador de la marca del modelo.

### Solicitud de ejemplo

```
POST /api/vehicle-models
Cookie: access_token={token};

Content-Type: application/json

{
    "vehicleModelName": "Cullinan",
    "transmissionType": "Manual",
    "passengerCount": 5,
    "imagePath": "1737728231555-rolls_royce_cullinan.jpg",
    "category": 2,
    "brand": 3
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
      "message": "El modelo ha sido registrado exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): transmissionType"
      }
      ```

  - Nombre ya utilizado:

    - Respuesta:

      ```
      {
          "message": "Se ha detectado un valor repetido que debería ser único."
      }
      ```

  - Cantidad de pasajeros y/o identificadores de la categoría o marca no numéricos o negativos:

    - Respuesta de ejemplo:

      ```
      {
          "message": "El campo \"passengerCount\" debe ser un número positivo"
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

- El campo **vehicleModelName** debe ser único en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.
