# DELETE /api/categories/:id
## Descripción
Este endpoint permite eliminar una categoría, a partir de su identificador.

## Solicitud
### Parámetros para la solicitud

#### URL

- id: integer, **obligatorio**. Identificador de la categoría.

#### COOKIES

- **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
    - Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
DELETE /api/categories/2
Cookie: access_token={token};
```

**Nota:** Se debe reemplazar {token} por un Token JWT válido.


## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta exitosa
- #### 200 OK
```
{
    "message":"La categoría ha sido eliminada exitosamente"
}
```

## Errores

- #### 400 Bad Request

    - Restricción de integridad:

        - Respuesta:

          ```
          {
              "message": "La categoría no se puede eliminar porque tiene modelos asociados."
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

- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.