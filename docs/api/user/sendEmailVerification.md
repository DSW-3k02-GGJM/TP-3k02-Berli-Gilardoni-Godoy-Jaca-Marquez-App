# sendEmailVerification

---
## Descripción
Este método permite envíar un mail de verificación de determinado email. 

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
    "message":"Se ha enviado un email de verificación a tu correo"
}
```