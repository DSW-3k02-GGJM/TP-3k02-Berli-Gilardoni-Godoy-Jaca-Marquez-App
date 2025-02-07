# POST /api/vehicles

## Descripción

Este endpoint permite crear un vehículo.

## Solicitud

### Parámetros para la solicitud

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
  - Este token debe ser enviado como una cookie en la solicitud.

#### BODY

- licensePlate: string, **obligatorio**. Patente del vehículo.
- manufacturingYear: integer, **obligatorio**. Año de fabricación del vehículo.
- totalKms: integer, **obligatorio**. Kilometraje total del vehículo.
- vehicleModel: integer, **obligatorio**. Identificador del modelo del vehículo.
- color: integer, **obligatorio**. Identificador del color del vehículo.
- location: integer, **obligatorio**. Identificador de la sucursal a la que corresponde el vehículo.

### Solicitud de ejemplo

```
POST /api/brands
Cookie: access_token={token};

Content-Type: application/json

{
    "licensePlate":"GNN430",
    "manufacturingYear":2015,
    "totalKms":0,
    "vehicleModel":12,
    "color":36,
    "location":17
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
      "message": "El vehículo ha sido registrado exitosamente"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): licensePlate"
      }
      ```

  - Patente ya utilizada:

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

- El campo **licensePlate** debe ser único en el sistema.

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.