## Variables de Entorno

### Tipos de datos, formatos esperados y descripciones

- **NODE_ENV**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u>
    - Uno de los siguientes valores:
      - 'test'
      - 'development'
      - 'production'
  - <u>Descripción:</u> Define el entorno de ejecución de la aplicación.

- **BACKEND_URL**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> URL válida.
  - <u>Descripción:</u> URL del servidor backend.

- **FRONTEND_URL**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> URL válida.
  - <u>Descripción:</u> URL del servidor frontend.

- **SECRET_KEY**, **SECRET_EMAIL_KEY**, **SECRET_PASSWORD_KEY**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> Cualquier cadena de texto, utilizada para encriptación y gestión de seguridad.
  - <u>Descripción:</u> Claves secretas utilizadas para encriptación de datos y contraseñas.

- **EMAIL_USER**, **ADMIN_EMAIL**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> Correo electrónico válido.
  - <u>Descripción:</u> Dirección de correo electrónico desde el cual se enviarán los emails generados a través de la aplicación y dirección de correo electrónico para el usuario administrador creado por defecto si no existe uno, respectivamente.

- **EMAIL_PASSWORD**, **ADMIN_PASSWORD**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> Cualquier cadena de texto, utilizada como contraseña.
  - <u>Descripción:</u> Contraseñas utilizadas para el email desde el cual se enviarán los emails generados a través de la aplicación y para el usuario administrador creado por defecto si no existe uno, respectivamente.

- **MYSQL_CONNECTION**, **MYSQL_CONNECTION_TEST**:

  - <u>Tipo de Dato:</u> String.
  - <u>Formato esperado:</u> Cadena de conexión válida para MySQL (**mysql://user:password@host:port/**).
  - <u>Descripción:</u> Cadenas de conexión a la base de datos principal y a la de pruebas, respectivamente.

- **DATABASE_NAME**:

  - <u>Tipo de Dato:</u> String
  - <u>Formato esperado:</u> Nombre válido para una base de datos.
    - Ejemplo: **alquiler_vehiculos**
  - <u>Descripción:</u> Nombre que se utilizará tanto para la base de datos principal como para la de pruebas.
