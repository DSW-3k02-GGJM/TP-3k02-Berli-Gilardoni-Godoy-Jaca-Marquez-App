# update

---
## Descripción
Este método permite actualizar datos de un usuario. 

---
## Solicitud
### Parámetros para la solicitud
* id: integer, **obligatorio**. Identificador del usuario.
* documentType: string, **obligatorio**. Tipo de documento del usuario.
* documentID: string, **obligatorio**. Numero de documento del usuario.
* userName: string, **obligatorio**. Nombre del usuario.
* userSurname: string, **obligatorio**. Apellido del usuario.
* birthDate: string, **obligatorio**. Fecha de nacimiento del usuario.
* address: string, **obligatorio**. Dirección del usuario.
* phoneNumber: string, **obligatorio**. Número de teléfono del usuario.
* nationality: string, **obligatorio**. Nacionalidad del usuario.
* role: string, **obligatorio**. Rol del usuario.
* verified: boolean, **obligatorio**. Muestra si el usuario está verificado o no.

---
## Respuesta
### Parámetros de respuesta
* message: string. Mensaje de confirmación.
### Respuesta de ejemplo
```
{
    "message":"El usuario ha sido actualizado exitosamente"
}
```