# verifyPasswordResetToken

---
## Descripción
Este método permite cambiar la contraseña de un usuario. Se fija si es que el token proporcionado es correcto.

---
## Solicitud
### Parámetros para la solicitud
* newPassword: string, nueva contraseña sin encriptar.
* confirmPassword: string, confirmación de la nueva contraseña sin encriptar.
* token: string, token de reestablecimiento de contraseña.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"Contraseña restablecida exitosamente"
}
```