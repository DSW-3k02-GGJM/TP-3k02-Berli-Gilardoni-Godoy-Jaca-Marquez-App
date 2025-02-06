# findOne

---
## Descripción
Este método devuelve un usuario a partir de su id.

---
## Solicitud
### Parámetros para la solicitud
* id: integer, **obligatorio**. Identificador del usuario.

---
## Respuesta
### Parámetros de respuesta
* id: integer, identificador del usuario.
* documentType: string, tipo de documento del usuario.
* documentID: string, numero de documento del usuario.
* userName: string, nombre del usuario.
* userSurname: string, apellido del usuario.
* birthDate: string, fecha de nacimiento del usuario.
* address: string, dirección del usuario.
* phoneNumber: string, número de teléfono del usuario.
* nationality: string, nacionalidad del usuario.
* email: string, email del usuario.
* password: string, contraseña encriptada del usuario.
* role: string, rol del usuario.
* verified: boolean, muestra si el usuario está verificado o no.

### Respuesta de ejemplo
```
{
  "message": "El usuario ha sido encontrado",
  "data": {
    "id": 1,
    "documentType": "DNI",
    "documentID": "XXXXXXXX",
    "userName": "Admin",
    "userSurname": "Admin",
    "birthDate": "2024-10-17",
    "address": "Admin",
    "phoneNumber": "XXXX-XXXX",
    "nationality": "Peruano",
    "email": "admin@admin.com",
    "password": "$2b$10$qhxYsqESkXBLrarN30inMOekR/Jr.A065VSbfzVE/AvJ1qR46uO6u",
    "role": "admin",
    "verified": true
  }
}
```