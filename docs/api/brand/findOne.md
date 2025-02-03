# findOne

---
## Descripción
Este método devuelve una marca a partir de su id.

---
## Solicitud
### Parámetros para la solicitud
* id: integer, **obligatorio**. Identificador de la marca.

---
## Respuesta
### Parámetros de respuesta
* id: integer, identificador de la marca.
* brandName: string, nombre de la marca.

### Respuesta de ejemplo
```
{
    "message":"La marca ha sido encontrada",
    "data":[
        {"id":2,"brandName":"Chevrolet"}
    ]
}
```