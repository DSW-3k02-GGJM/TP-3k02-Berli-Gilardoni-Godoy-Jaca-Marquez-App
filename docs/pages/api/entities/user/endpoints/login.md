# POST /api/users/login

## Descripción

Este endpoint permite que un usuario inicie sesión en el sistema.

Se llevan a cabo las validaciones para comprobar que:

- La combinación del email y la contraseña sean correctos.
- La cuenta se encuentre verificada.

## Solicitud

### Parámetros para la solicitud

#### BODY

- email: string, **obligatorio**. Email del usuario.
- password: string, **obligatorio**. Contraseña del usuario.

### Solicitud de ejemplo

```
POST /api/users/login

Content-Type: application/json

{
    "email": "nicolasgimenez@gmail.com",
    "password": "654321"
}
```

## Respuesta

### Parámetros de respuesta

- message: string. Mensaje de confirmación.

### Respuesta exitosa

- #### 200 OK

  ```
  {
      "message": "Inicio de sesión exitoso"
  }
  ```

## Errores

- #### 400 Bad Request

  - Parámetros requeridos en el cuerpo de la solicitud no proporcionados:

    - Respuesta de ejemplo:

      ```
      {
          "message": "Toda la información es requerida. Falta(n): password"
      }
      ```

  - Formato incorrecto para el email:

    - Respuesta:

      ```
      {
          "message": "El campo \"email\" debe ser una dirección de correo electrónico válida"
      }
      ```

- #### 401 Unauthorized

  - La combinación del email y la contraseña no existe:

    - Respuesta:

      ```
      {
          "message": "El email y/o la contraseña son incorrectos"
      }
      ```

- #### 403 Forbidden

  - La cuenta del usuario no se encuentra verificada:

    - Respuesta:

      ```
      {
          "message": "Cuenta no verificada"
      }
      ```

- #### 500 Internal Server Error

  - Error de conexión con el servidor:

    - Respuesta:

      ```
      {
          "message": "Error de conexión"
      }
      ```

## Consideraciones

- Se genera un token único de sesión y se almacena en una cookie httpOnly llamada **'access_token'**.

  - Aunque la cookie no es accesible desde el lado del cliente, el navegador la enviará automáticamente en las siguientes solicitudes al servidor mientras la sesión esté activa y el usuario utilice la aplicación.

  - La cookie tiene las siguientes características principales:

    - **httpOnly**: true.

      - Solo es accessible desde el lado del servidor.

    - **secure**: true.

      - Solo se envía a través de conexiones HTTPS.

    - **sameSite**: 'strict'.

      - Solo se envía en solicitudes que se originan desde el mismo sitio.

    - **maxAge**: 1000 \* 60 \* 60.

      - Expira en 1 hora.
