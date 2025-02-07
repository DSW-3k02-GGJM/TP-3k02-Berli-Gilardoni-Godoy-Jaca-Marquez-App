# sendPasswordReset

---
## Descripción
Este método permite envíar un mail para reestablecer la contraseña de un usuario. 

---
## Solicitud
### Parámetros para la solicitud
* email: string, **obligatorio**. Email del usuario.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"Solicitud exitosa"
}
```