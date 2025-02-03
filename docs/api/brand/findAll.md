# findAll

---
## Descripción
Este método devuelve todas las marcas almacenadas en la base de datos en forma de objetos.

---
## Solicitud
### Parámetros de solicitud
No es necesario utilizar ningún parámetro para realizar la solicitud.

---
## Respuesta
### Parámetros de respuesta
* data: object array. Array que contiene la/s marca/s encontradas como objetos. Sus atributos son:
  * id: integer, identificador de la marca.
  * brandName: string, nombre de la marca.

### Respuesta de ejemplo
```
{
    "message":"Todas las marcas han sido encontradas",
    "data":[
        {"id":2,"brandName":"Chevrolet"},
        {"id":3,"brandName":"Ford"},
        {"id":1,"brandName":"Toyota"}
    ]
}
```