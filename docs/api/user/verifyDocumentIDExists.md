# verifyDocumentIDExists
---
## Descripción
Este método permite verificar el número de documento dado ya está siendo usado por otro usuario.

---
## Solicitud
### Parámetros de solicitud
* id: integer, **obligatorio**. Identificador del usuario.
* documentID: string, **obligatorio**. Numero de documento del usuario.

---
## Respuesta
### Parámetros de respuesta
* exists: boolean. Muestra si el número de documento está siendo usado o no.

### Respuesta de ejemplo
```
{
    "exists": false
}
```