# verifyBrandNameExists

---
## Descripción
Este método se utiliza para verificar si un nombre se encuentra disponible antes de crear o modificar una marca.

---
## Solicitud
### Parámetros de solicitud
* brandName: string, **obligatorio**. Nombre de la marca.
* id: integer, **opcional**. Identificador de la marca.

---
## Respuesta

Devuelve true si el nombre se encuentra en uso, false en caso contrario.
### Parámetros de respuesta
* exists: boolean. Indica si el nombre de la marca se encuentra en uso.

### Respuesta de ejemplo
```
{
    "exists":false
}
```