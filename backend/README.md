# Trabajo Práctico - Desarrollo de Software (Backend)

## Instalación de dependencias

1. Ejecutá el siguiente comando en consola:

```
   npm install
```

2. Configurá VSCode con estas settings:

![Configuración de VSCode](./assets/vs-code-settings.png)

## Pasos previos a la compilación y ejecución

1. **Creación del archivo .env**:

   Creá un archivo llamado '**.env**' que siga la forma de '**[./backend/.env.example](./.env.example)**', en la misma ubicación que dicho archivo, y completá la información correspondiente.

> ⚠️ **Nota:** Asegurate de darle a tu variable de entorno **NODE_ENV** el valor '**development**' para poder iniciar correctamente la aplicación.

2. **Configuración de la conexión MySQL**:

   Creá una Conexión MySQL Local y asignale el String de Conexión correspondiente a la variable de entorno **MYSQL_CONNECTION**, siguiendo el formato que se indica en el archivo de ejemplo mencionado.

3. **Base de datos para pruebas**:

   Repetí el paso anterior para tener una base de datos adicional, de forma que puedas ejecutar después los tests automatizados, sin que estos afecten a la base de datos principal.

> ⚠️ **Nota:** El String de Conexión de la base de datos para pruebas debe asignarse a la variable de entorno **MYSQL_CONNECTION_TEST**.

- **IMPORTANTE**:

  - Es obligatorio asignarle valor tanto a **MYSQL_CONNECTION** como a **MYSQL_CONNECTION_TEST**, para que la aplicación funcione correctamente.

  - Aunque no es imprescindible, también podés asignarle valores a otras variables de entorno como **DATABASE_NAME** si querés personalizar el nombre de la base de datos que se utilizará antes de su creación.

    La base de datos será creada automáticamente por el ORM si no existe al momento de la ejecución de la aplicación, con el nombre especificado o el valor por defecto. Si decidís usar un nombre específico, asegurate de que esté bien configurado en la variable de entorno mencionada, y de mantener el mismo desde la primera ejecución.

  > 💡 **Sugerencia:** Para más información sobre los valores esperados y descripciones de las variables de entorno, consultá **[environment-variables](./environment-variables.md)**.

## Compilación y ejecución de la aplicación

### Compilación

1. Ejecutá el siguiente comando en consola para compilar la aplicación:

```
   npm run build
```

### Ejecución

1. Ejecutá el siguiente comando en consola para iniciar el servidor:

```
   npm start
```

#### ✅ Éxito al ejecutar el servidor

Una vez que el servidor se inicie correctamente, deberías ver en consola, entre otros mensajes:

- Los logs de sincronización de la base de datos (o la creación de la misma si no existiera) por parte del ORM.

- Un mensaje de confirmación indicando que el servidor se está ejecutando, del estilo:

  ```
  Server running at {BACKEND_URL}
  ```

  Donde `{BACKEND_URL}` será el valor que le definiste a la variable de entorno con ese mismo nombre, o el valor por defecto en caso contrario (http://localhost:3000/).

  #### Verificación de Logs

  A partir de ese momento, siempre y cuando la variable de entorno **NODE_ENV** esté correctamente seteada con el valor '**development**', podrás visualizar los logs de las consultas SQL que ejecuta el ORM durante la ejecución de la aplicación.

  Esto te permitirá verificar que la base de datos se sincroniza correctamente y que las consultas están funcionando como se espera.

#### 🚨 Posibles errores al ejecutar el servidor:

Si la aplicación no se inicia correctamente, revisá los siguientes problemas comunes:

- **Variables de Entorno requeridas no proporcionadas**.

  En este caso, verás un error en consola del estilo:

  ```
  ❌ Error in environment variables:
  - MYSQL_CONNECTION: Required
  ```

  Donde se indicarán todas las variables de entorno a las que se le debe asignar un valor y no se lo ha hecho.

- **Base de Datos no disponible en la dirección del string de conexión indicado en las variables de entorno**:

  En este caso, verás un error en consola del estilo:

  ```
  Error: connect ECONNREFUSED 127.0.0.1:3308
      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1595:16) {
    errno: -4078,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 3308,
    fatal: true
  }

  Node.js v20.11.1
  ```

  Donde la información específica dependerá del string de conexión que hayas especificado, y de la versión de Node que tengas instalada en tu dispositivo.
