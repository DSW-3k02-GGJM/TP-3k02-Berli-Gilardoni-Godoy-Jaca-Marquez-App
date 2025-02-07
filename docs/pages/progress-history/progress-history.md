# Minutas de Reunión y Avance

<h2 align="center">Alquilcar Reservas 🚗</h2>
<table align="center">
  <tbody>
    <tr style="text-align: center;">
      <td width="20%" style="padding-bottom: 10px;"><a href="https://github.com/na04ber"><img src="https://avatars.githubusercontent.com/u/164286460?v=4" width="100" alt="Berli, Nahuel"/><br/><b>Berli, Nahuel</b></a></td>
      <td width="20%" style="padding-bottom: 10px;"><a href="https://github.com/GilardoniLucio"><img src="https://avatars.githubusercontent.com/u/164241068?v=4" width="100" alt="Gilardoni, Lucio"/><br/><b>Gilardoni, Lucio</b></a></td>
      <td width="20%" style="padding-bottom: 10px;"><a href="https://github.com/Marcos-Godoy"><img src="https://avatars.githubusercontent.com/u/82327926?v=4" width="100" alt="Godoy, Marcos"/><br/><b>Godoy, Marcos</b></a></td>
    </tr>
    <tr style="text-align: center;">
      <td width="20%" style="padding-bottom: 10px;"><a href="https://github.com/juampi74"><img src="https://avatars.githubusercontent.com/u/126622905?v=4" width="100" alt="Jaca, Juan Pablo"/><br/><b>Jaca, Juan Pablo</b></a></td>
      <td width="20%" style="padding-bottom: 10px;"><a href="https://github.com/MatiPoli"><img src="https://avatars.githubusercontent.com/u/70172645?v=4" width="100" alt="Márquez, Matías"/><br/><b>Márquez, Matías</b></a></td>
    </tr>
  </tbody>
</table>

## 07/04/2024

- Discusión de ideas sobre el tema en el que se basará el proyecto.

- Elección final del tema: **Alquiler de Vehículos**.

## 08/04/2024

- Realización de la primera versión del modelo de datos.

- Definición del alcance funcional del proyecto, para regularidad y aprobación.

## 17/05/2024

- Decisión de tener el backend y el frontend en un mismo repositorio.

## 20/05/2024

- Realización del primer commit en el repositorio.

- Configuración inicial de TypeScript.

## 21/05/2024

- Configuración inicial de Express.

- Definición de las primeras entidades en el backend, manejadas en memoria sin persistencia.

## 23/05/2024

- Realización del boilerplate del frontend utilizando Angular y TypeScript.

- Definición de la estructura inicial de carpetas.

## 10/06/2024

- Primera implementación de MongoDB para persistir la información.

## 14/06/2024

- Configuración inicial de MikroORM.

- Primera versión oficial del frontend del proyecto.

## 08/07/2024

- Idea de migrar de MongoDB a MySQL.

## 15/07/2024

- División de responsabilidades entre los integrantes del grupo para realizar los CRUDs de las entidades.

## 30/07/2024

- Migración definitiva de MongoDB a MySQL.

- Modificaciones en el modelo de datos y en el alcance del proyecto.

- Configuración inicial de MySQL, en conjunto con MikroORM y Docker.

- Primeras solicitudes/requests HTTP desde el frontend al backend.

## 07/08/2024

- Puesta en funcionamiento de las primeras versiones de los CRUDs de las entidades:

  - Cliente.
  - Marca.

  Persistiendo la información en una base de datos MySQL a través de MikroORM, transferida a través de solicitudes HTTP.

## 08/08/2024

- Implementación del CRUD de la entidad Categoría, utilizando Reactive Forms de Angular.

- Adaptación de los CRUDs exitentes para unificar con dicho estilo de formularios.

## 09/08/2024

- Desarrollo de un buscador con filtro por nombre para las entidades cuyos CRUDs ya fueron realizados.

- Arreglo de conflictos en las dependencias del frontend.

## 10/08/2024

- Implementación de los CRUDs de las entidades:

  - Modelo.
  - Sucursal.
  - Color.

- Decisión de traducir todo el código del proyecto a inglés, a excepción de lo que se le muestra al usuario que lo utiliza.

## 11/08/2024

- Adaptación de tablas en las que se muestra la información de las entidades, para mejorar el responsive.

## 12/08/2024

- Modificación en los formularios, para que sean ventanas modales.

- Intento de generalización de los formularios.

## 17/08/2024

- Primera versión del sistema de autenticación de usuarios.

## 22/08/2024

- Implementación del Login y del Register, utilizando:

  - JSON Web Token (JWT).
  - Guards de Angular.

- Inicio de implementación del Logout.

## 23/08/2024

- Consulta en clase sobre el tema de la autenticación y roles de usuarios.

## 28/08/2024

- Implementación del CRUD de la entidad Vehículo.

## 29/08/2024

- Puesta en funcionamiento del Logout en el sistema de autenticación.

- Creación de un archivo .env en el backend, para manipular variables de entorno.

- Primera versión de manejo de imágenes para los vehículos.

## 30/08/2024

- Decisión de que las imágenes sean para cada modelo, y no para cada vehículo.

- Idea de filtro que obtenga los vehículos disponibles para un rango de fechas y en una sucursal, que muestre un vehículo por modelo, junto con la imagen.

- Comienzo de la traducción del proyecto a inglés.

## 03/09/2024

- Traducción completa del proyecto a inglés.

## 06/09/2024

- Refactorización del Login, Register y Logout, para mejorar la interactividad con el usuario.

## 07/09/2024

- Implementación del CRUD de la entidad Reserva.

## 10/09/2024

- Implementación inicial del sistema de roles en el backend, utilizando los siguientes:

  - admin.
  - employee.
  - client.

## 23/09/2024

- Idea de implementar el envío de emails a clientes, tanto personalizados como de recordatorios de reservas.

- Primera implementación del check-in y check-out de las reservas.

## 24/09/2024

- Modificación general de la estética visual del frontend, implementando, entre otras cosas, un carrusel de imágenes en la página principal.

- Primer acercamiento a la utilización de Angular Material para unificar estilos.

## 10/10/2024

- Idea de volver atrás la decisión de que los formularios en los CRUDs sean modales, con el objetivo de que se pueda navegar correctamente mediante rutas.

## 22/10/2024

- Migración de todos los formularios al nuevo formato.

- Implementación de validaciones en los campos de los formularios.

- Creación automática de un usuario con el rol 'admin' al ejecutar el backend, si no existe uno.

## 31/10/2024

- Implementación de mensajes amigables para el administrador cuando intenta eliminar una entidad que está relacionada con otra.

## 01/11/2024

- Implementación de validaciones de unicidad de atributos específicos de entidades en los formularios.

- Mejora estética de las barras de búsqueda que aplican filtros sobre las tablas que muestran la información de las entidades.

## 09/11/2024

- Implementación del cálculo del precio de una reserva.

- Modificación del pipe general que realiza el filtro sobre las entidades en las barras de búsqueda, para que funcione con atributos anidados.

- Modificaciones en la tabla de reservas, para prohibir la cancelación y eliminación de aquellas para las que ya se realizó el check-out.

## 10/11/2024

- Eliminación de posibilidad de modificación de una reserva, dado que no tiene sentido por como está armado.

## 11/11/2024

- Adaptaciones responsive en los estilos de las tarjetas que muestran las imágenes de los modelos de los vehículos disponibles al realizar una reserva.

- Actualización de la documentación del proyecto, detallando las instrucciones para la instalación y la ejecución del mismo.

## 12/11/2024

- Armado de la arquitectura/estructura que permitirá implementar el envío de emails en el proyecto.

- Nueva actualización de la documentación del proyecto, entre otras cosas, para agregar un enlace a un video de demostración de las principales funcionalidades de la aplicación.

- Limpieza de código general.

- Agregado de nuevas validaciones en el frontend.

## 13/11/2024

- Implementación de un sistema de veriicación de cuentas de usuarios mediante correo electrónico.

- Agregado en la documentación de un archivo .sql para importar datos y facilitar el uso de la aplicación.

## 15/11/2024

- Implementación de un sistema de cambio de contraseñas mediante correo electrónico.

## 18/11/2024

- Retoques de estilos en el frontend.

## 08/12/2024

- Implementación completa del envío de emails personalizados a clientes, por parte de los usuarios de rol 'admin' y de los de rol 'employee'.

## 10/12/2024

- Agregado de filtro por fecha para las reservas.

## 11/12/2024

- Desarrollo de una sección de 'Mis reservas', en la que los usuarios de rol 'client' puedan visualizar la información de las reservas que le pertenecen.

- Implementación del middleware Multer para manejar de una mejor manera el guardado de las imágenes para los modelos de los vehículos.

## 12/12/2024

- Agregado de opción de cancelar una reserva desde la vista del cliente.

- Centralización del acceso al string de conexión a la base de datos en las variables de entorno.

## 14/12/2024

- Implementación completa de un sistema de envío de recordatorios mediante correo electrónico, que se envían automáticamente un día antes de las reservas al cliente que corresponda.

- Agregado de opción de cancelar una reserva desde la vista del administrador y del empleado, deshabilitando la misma una vez que ya se realizó el check-in para la reserva.

- Desarrollo de la lógica para deshabilitar el check-in y la cancelación según la fecha actual.

## 17/12/2024

- Puesta en funcionamiento por completo del manejo de imágenes para los modelos de los vehículos utilizando Multer.

## 25/12/2024

- Reorganización de la estructura de carpetas, limpieza y refactorización del código.

- Implementación de validaciones sobre las variables de entorno presentes en el archivo .env del backend, utilizando la librería Zod.

  - Acceso centralizado a las variables de entorno en este archivo de validaciones.

- Unificación de mensajes de error en el login, para una mayor seguridad.

- Encapsulamiento de solicitudes HTTP desde el frontend en servicios, sin hacer ninguna directamente desde un componente.

- Unificación de convención de nombres de archivos y de rutas, sin mezclar nomenclaturas como camelCase y dash-case.

## 07/01/2025

- Deshabilitación de los botones de envío en los formularios cuando la información ingresada no es válida, utilizando la opción updateOn: 'blur', que permite, en los Reactive Forms de Angular, validar al momento de que el usuario sale del foco de un campo.

## 08/01/2025

- Mejora en la validación de fechas en general, principalmente para la mayoría de edad de los usuarios, y para el rango de fechas para una reserva.

## 14/01/2025

- Armado de un servicio específico para cada entidad en el frontend (hasta el momento era uno genérico que tenía requests dinámicos), que permita comunicarse mediante solicitudes HTTP con la API del backend, preservando la seguridad de tipos y mejorando la validación de los datos enviados y recibidos.

- Implementación de interfaces con el objetivo de definir el formato esperado para la información enviada y la recibida.

- Generaliación de los Guards de Angular en uno solo que realice todas las validaciones necesarias relacionadas con autenticación y roles previo a permitir que un usuario acceda a una ruta específica del frontend.

- Generalización de ventanas modales de confirmación en una sola.

## 15/01/2025

- Obtención de información que se le muestra al usuario directamente desde la API del backend.

- Recarga de la información de las entidades consultando la base de datos una vez que se elimina alguna, en lugar de simplemente filtrar la misma de la lista en memoria.

- Creación de un componente con los botones de acciones en las tablas, para evitar código repetido.

## 16/01/2025

- Implementación de variables para los colores en las hojas de estilo.

- Mejoras en el responsive de las tarjetas que muestran las imágenes de los modelos de los vehículos al momento de realizar una reserva.

## 19/01/2025

- Generalización de los sanitizedInput del backend en una sola función que, según los parámetros recibidos, realiza las validaciones correspondientes sobre la información que llega en las solicitudes HTTP, antes de procesarla.

- Solución de error responsive que generaba que, en pantallas chicas, los mensajes de error provocados por las validaciones en los formularios se solapen o queden por encima de otros elementos.

- Agregado de funcionalidad de cierre de las barras de navegación en pantallas chicas, al redirigirse a una nueva ruta.

## 20/01/2025

- Agregado de funcionalidad al momento del check-out de una reserva, haciendo necesario indicar el kilometraje actual del vehículo y si se tiene que devolver o no el depósito en garantía al cliente.

- Agregado, con el mismo objetivo, de un campo final_price en la tabla de reservas en la base de datos, que almacene, luego del cálculo realizado, el precio final de la reserva en base a la información del ítem anterior.

- Mejoras en el responsive de las tablas que muestran la información de las entidades.

## 24/01/2025

- Unificación de todos los campos relacionados con fechas en la base de datos a tipo DATE (en tablas de reservas y recordatorios).

- Modificación del tipo de dato de los campos relacionados a precios a INT, para que sea acorde a como están manejados en el proyecto.

- Agregado de validaciones que aseguren que los campos numéricos en los formularios solo acepten valores enteros, sin decimales.

- Traducción de los mensajes devueltos por la API del backend a español, para mostrarle los mismos directamente al usuario en el frontend.

- Agregado de validaciones en el backend para mejorar la integridad, comprobando nuevamente que un vehículo se encuentre disponible antes de confirmar la reserva del mismo.

- Separación en el backend de la lógica del check-out de una reserva en relación a un simple update, para poder manejar correctamente la actualización del kilometraje del vehículo y de los datos de la reserva dentro de una transacción.

- Modificación de la lógica de eliminación de las reservas, para permitirla únicamente si todavía no se le envió el recordatorio al cliente.

- Optimización de imágenes del proyecto.

- Actualización del modelo de datos y del archivo .sql con datos de prueba para que sean acordes a los cambios realizados.

## 25/01/2025

- Implementación del Test Unitario de un Componente en el Frontend utilizando Jasmine y Karma, con el objetivo de probar de forma automática el correcto funcionamiento del componente que representa al formulario desde el cual se puede tanto registrar nuevos vehículos como editar existentes.

- Unificación del manejo de fechas en el proyecto utilizando la librería date-fns, eliminando el uso de las librerías luxon y moment.

## 01/02/2025

- Implementación de la primera versión del Test End-to-End (E2E) en el Frontend utilizando Cypress, con el objetivo de probar de forma automática el correcto funcionamiento del flujo completo de la aplicación.

## 03/02/2025

- Documentación de los endpoints de la API del backend para la primera entidad (Marca), indicando, entre otras cosas, parámetros para la solicitud, solicitud de ejemplo, parámetros de respuesta, posibles errores, consideraciones de autenticación.

## 04/02/2025

- Puesta en funcionamiento por completo del Test End-to-End (E2E) del Frontend.

## 05/02/2025

- Documentación de los endpoints de la API del backend para la entidad Usuario.

## 06/02/2025

- Implementación de Tests en el Backend utilizando Jest y Supertest, con el objetivo de probar de forma automática el correcto funcionamiento de cada uno de los endpoints disponibles en la API del backend.

- Actualización del video de demostración de las principales funcionalidades de la aplicación.

- Eliminación de archivos .http en el backend, que en su momento probaban el funcionamiento de los endpoints de la API, dado que no cuentan con la autenticación requerida, y los tests implementados ya cubren automáticamente la que era su funcionalidad.

- Modificaciones varias en la documentación del proyecto, con el objetivo de:

  - Actualizar instrucciones de instalación y ejecución del proyecto.

  - Detallar instrucciones de ejecución de los tests automáticos.

  - Mostrar evidencia de ejecución de los tests automáticos.

## 07/02/2025

- Agregado de esta sección de 'Minutas de Reunión y Avance'.
