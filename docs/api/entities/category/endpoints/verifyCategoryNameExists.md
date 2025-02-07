# GET /api/category/category-name-exists/:categoryName/:id

## Descripción
Este método se utiliza para verificar si un nombre se encuentra disponible antes de crear o modificar una categoría.

Se devolverá `true` si el nombre de la categoría ya está en uso y el `id` de la categoría con ese nombre no coincide con el `id` pasado por parámetro. De lo contrario, se devolverá `false`.

---
## Solicitud

### Parámetros para la solicitud

#### URL
* categoryName: string, **obligatorio**. Nombre de la categoría.
* id: integer, **opcional**. Identificador de la categoría.
    * Utilizar -1 en el caso de la creación de una categoría.

#### COOKIES
* **access_token**: string, **obligatorio**. Token JWT válido para autenticar al usuario.
    * Este token debe ser enviado como una cookie en la solicitud.

### Solicitud de ejemplo

```
GET /api/category/category-name-exists/SUV/-1
Cookie: access_token={token};
```
**Nota:** Se debe reemplazar {token} por un Token JWT válido.

## Respuesta
### Parámetros de respuesta
* exists: boolean. Indica si el nombre de la categoría se encuentra en uso.

### Respuesta de ejemplo
* #### 200 OK

    ```
    {
        "exists":true
    }
    ```

## Errores
* #### 401 Unauthorized
    * Token de autenticación no proporcionado:
        * Respuesta:

            ```
            {
                "message": "Acceso no autorizado (token no proporcionado)"
            }
            ```
          
* #### 403 Forbidden
  * Acceso restringido por falta de permisos:
    * Respuesta:
      ```
      {
        "message": "Acceso restringido (rol sin permisos)"
      }
      ```
  
## Consideraciones
- Este endpoint está protegido y requiere autenticación. El token JWT debe ser proporcionado como una cookie llamada `access_token` en la solicitud.

- El usuario autenticado debe ser un administrador (rol **'admin'**) para poder utilizar este endpoint.