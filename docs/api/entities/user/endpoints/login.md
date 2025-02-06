# login

---
## Descripción
Este método permite a un usuario logearse, verificando que el email y la contraseña sean correctos. Luego verifica que la cuenta esté verificada.

---
## Solicitud
### Parámetros de solicitud
* email: string, **obligatorio**. Email del usuario.
* password: string, **obligatorio**. Contraseña no encriptada del usuario.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.
### Cookie
Se devuelve una cookie llamada 'access_token' que contiene un token. Este token se asocia con este usario y dura una hora. Representa la sesión del usuario.

Las características de la cookie son:
* httOnly: true, solo es accessible desde el lado del servidor.
* secure: true, solo se envía a través de conecciones HTTPS.
* sameSite: 'strict', solo se envía en solicitudes que se originan desde el mismo sitio.
* maxAge: 1000 * 60 * 60, expira en 1 hora.

### Respuesta de ejemplo
```
{
    "message":"Inicio de sesión exitoso"
}
```