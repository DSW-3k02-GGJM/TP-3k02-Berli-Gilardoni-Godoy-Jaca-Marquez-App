# verifyEmailToken

---
## Descripción
Este método permite verificar el email de un usuario. Se fija si es que el token proporcionado es correcto.

---
## Solicitud
### Parámetros para la solicitud
* token: string, token de verificación de email.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"Su cuenta ha sido verificada"
}
```