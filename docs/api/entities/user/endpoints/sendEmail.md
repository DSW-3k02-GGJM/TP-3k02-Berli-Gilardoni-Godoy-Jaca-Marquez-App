# sendEmail

---
## Descripción
Este método permite envíar un mail a un determinado usuario. 

---
## Solicitud
### Parámetros para la solicitud
* email: string, **obligatorio**. Email del usuario.
* subject: string, **obligatorio**. Destinario del mail.
* message: string, **obligatorio**. Contenido del mail.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"Email enviado"
}
```