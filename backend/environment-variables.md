## Variables de Entorno

### Tipos de datos, formatos esperados y descripciones

- **NODE_ENV**:

  - Tipo de Dato: String.
  - Formato esperado:
    - Uno de los siguientes valores:
      - 'test'
      - 'development'
      - 'production'
  - Descripción: Define el entorno de ejecución de la aplicación.

- **BACKEND_URL**:

  - Tipo de Dato: String.
  - Formato esperado: URL válida.
  - Descripción: URL del servidor backend.

- **FRONTEND_URL**:

  - Tipo de Dato: String.
  - Formato esperado: URL válida.
  - Descripción: URL del servidor frontend.

- **SECRET_KEY**, **SECRET_EMAIL_KEY**, **SECRET_PASSWORD_KEY**:

  - Tipo de Dato: String.
  - Formato esperado: Cualquier cadena de texto, utilizada para encriptación y gestión de seguridad.
  - Descripción: Claves secretas utilizadas para encriptación de datos y contraseñas.

- **EMAIL_USER**, **ADMIN_EMAIL**:

  - Tipo de Dato: String.
  - Formato esperado: Correo electrónico válido.
  - Descripción: Dirección de correo electrónico desde el cual se enviarán los emails generados a través de la aplicación y dirección de correo electrónico para el usuario administrador creado por defecto si no existe uno, respectivamente.

- **EMAIL_PASSWORD**, **ADMIN_PASSWORD**:

  - Tipo de Dato: String.
  - Formato esperado: Cualquier cadena de texto, utilizada como contraseña.
  - Descripción: Contraseñas utilizadas para el email desde el cual se enviarán los emails generados a través de la aplicación y para el usuario administrador creado por defecto si no existe uno, respectivamente.

- **MYSQL_CONNECTION**, **MYSQL_CONNECTION_TEST**:

  - Tipo de Dato: String.
  - Formato esperado: Cadena de conexión válida para MySQL (mysql://user:password@host:port/).
  - Descripción: Cadenas de conexión a la base de datos principal y a la de pruebas, respectivamente.

- **DATABASE_NAME**:

  - Tipo de Dato: String
  - Formato esperado: Nombre válido para una base de datos.
    - Ejemplo: alquiler_vehiculos
  - Descripción: Nombre que se utilizará tanto para la base de datos principal como para la de pruebas.
