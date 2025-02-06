# register

---
## Descripción
Este método permite el registro de un usuario nuevo. Desencadenando la verificación del correo para poder completar el registro. Se encripta la contraseña previamente a guardarla.

---
## Solicitud
### Parámetros para la solicitud
* documentType: string, **obligatorio**. Tipo de documento del usuario.
* documentID: string, **obligatorio**. Numero de documento del usuario.
* userName: string, **obligatorio**. Nombre del usuario.
* userSurname: string, **obligatorio**. Apellido del usuario.
* birthDate: string, **obligatorio**. Fecha de nacimiento del usuario.
* address: string, **obligatorio**. Dirección del usuario.
* phoneNumber: string, **obligatorio**. Número de teléfono del usuario.
* nationality: string, **obligatorio**. Nacionalidad del usuario.
* email: string, **obligatorio**. Email del usuario.
* password: string, **obligatorio**. Contraseña no encriptada del usuario.
* role: string, **obligatorio**. Rol del usuario.
* verified: boolean, **obligatorio**. Muestra si el usuario está verificado o no.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"Registro exitoso"
}
```