# verifyEmailExists

---
## Descripción
Este método permite verificar el email dado ya está siendo usado por otro usuario.

---
## Solicitud
### Parámetros de solicitud
* email: string, **obligatorio**. Email del usuario.

---
## Respuesta
### Parámetros de respuesta
* exists: boolean. Muestra si el email está siendo usado o no.

### Respuesta de ejemplo
```
{
    "exists": false
}
```