# update

---
## Descripción
Este método permite actualizar datos de una marca. 

---
## Solicitud
### Parámetros para la solicitud
* id: integer, **obligatorio**. Identificador de la marca.
* brandName: string, **obligatorio**. Nuevo nombre de la marca.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.
### Respuesta de ejemplo
```
{
    "message":"La marca ha sido actualizada exitosamente"
}
```