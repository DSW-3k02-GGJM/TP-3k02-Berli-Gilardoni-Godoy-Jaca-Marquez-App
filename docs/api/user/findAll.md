# findAll

---
## Descripción
Este método devuelve todos los usuarios en la base de datos en forma de objetos.

---
## Solicitud
### Parámetros de solicitud
No es necesario utilizar ningún parámetro para realizar la solicitud.

---
## Respuesta
### Parámetros de respuesta
* data: object array. Array que contiene lo/s usuario/s encontrados como objetos. Sus atributos son:
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
  "message": "Todos los usuarios han sido encontrados",
  "data": [
    {
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
    },
    {
      "id": 5,
      "documentType": "DNI",
      "documentID": "12312341",
      "userName": "Maty",
      "userSurname": "Figoniiii",
      "birthDate": "2003-02-21",
      "address": "Av Calambres 123",
      "phoneNumber": "234 123122",
      "nationality": "Boliviano",
      "email": "matfigo@gmail.com",
      "password": "$2b$10$9sHmdjrbLt.StXLnZTjW8e1aqHRMWyXeffMBzWwpItaQmTpb5uSs6",
      "role": "client",
      "verified": true
    },
    {
      "id": 6,
      "documentType": "Pasaporte",
      "documentID": "12312311",
      "userName": "ejemplo2",
      "userSurname": "dasdassss",
      "birthDate": "2003-02-22",
      "address": "asdas 123",
      "phoneNumber": "525123",
      "nationality": "adsdas",
      "email": "ejemplo2@gmail.com",
      "password": "$2b$10$.Ae6uP/49WvVt0wWaRq59.Q64HEsTDGaKK0bbeZhdfaMu99XDfSeq",
      "role": "client",
      "verified": true
    }
  ]
}
```