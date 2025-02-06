# Propuesta

## Modelo de Datos

![Modelo de Datos](../assets/tp-dsw.png)

## Alcance Funcional

### Regularidad:

| Req                     | Detalle                                                                                                                                                                                              |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD simple             | 1. CRUD Categoría<br>2. CRUD Color<br>3. CRUD Marca<br>4. CRUD Sucursal<br>5. CRUD Usuario                                                                                                           |
| CRUD dependiente        | 1. CRUD Modelo {depende de} CRUD Categoría y Marca<br>2. CRUD Reserva {depende de} CRUD Vehículo y Usuario<br>3. CRUD Vehículo {depende de} CRUD Color, Modelo y Sucursal                            |
| Listado<br>+<br>detalle | 1. Listado de reservas filtrado por fecha<br>2. Listado de vehículos disponibles filtrado por rango de fechas solicitado para una reserva<br>3. Listado de usuarios filtrado por número de documento |
| CUU/Epic                | 1. Reservar un vehículo<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out de una reserva                                                                                         |

### Adicionales para Aprobación

| Req      | Detalle                                                                                                                                                                                                                                             |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD     | 1. CRUD Categoría<br>2. CRUD Color<br>3. CRUD Marca<br>4. CRUD Sucursal<br>5. CRUD Usuario<br>6. CRUD Modelo<br>7. CRUD Reserva<br>8. CRUD Vehículo                                                                                                 |
| CUU/Epic | 1. Reservar un vehículo<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out de una reserva<br>4. Cancelar reserva<br>5. Enviar recordatorios de reserva a los clientes<br>6. Comunicarse con clientes mediante correo electrónico |
