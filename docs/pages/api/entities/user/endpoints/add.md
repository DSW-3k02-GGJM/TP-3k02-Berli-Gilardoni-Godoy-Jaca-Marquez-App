# add

---
## Descripción
Este método permite la creación de un usuario. Se encripta la contraseña previamente a guardarla.

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
* password: string, **obligatorio**. Contraseña encriptada del usuario.
* role: string, **obligatorio**. Rol del usuario.
* verified: boolean, **obligatorio**. Muestra si el usuario está verificado o no.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.

### Respuesta de ejemplo
```
{
    "message":"El usuario ha sido registrado exitosamente"
}
```