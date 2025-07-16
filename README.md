# Movie Reviews – Guía de Instalación y Uso

## Requisitos Previos
- **Node.js** y **npm** instalados
- **MySQL** (recomendado XAMPP o similar)
- Navegador web

## 1. Clonar o descargar el proyecto
Descarga o clona este repositorio en tu PC.

## 2. Configurar la base de datos
1. Inicia MySQL (por ejemplo, desde XAMPP).
2. Crea la base de datos y tablas ejecutando el script `database.sql`:
   - Abre **phpMyAdmin** o una terminal MySQL.
   - Ejecuta el contenido de `movie-reviews/backend/database.sql` (debes pegar el SQL correspondiente).

## 3. Configurar variables de entorno
1. Ve a la carpeta `movie-reviews/backend/`.
2. Abre el archivo `.env` y asegúrate de tener:
   ```
   PORT=3002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=movie_reviews
   JWT_SECRET=tu_jwt_secreto
   ```
   - Si usas XAMPP, normalmente la contraseña de root es vacía.

## 4. Instalar dependencias del backend
1. Abre una terminal en `movie-reviews/backend/`.
2. Ejecuta:
   ```
   npm install
   ```

## 5. Iniciar el backend
1. En la misma terminal, ejecuta:
   ```
   npm start
   ```
2. El backend debe mostrar `Servidor corriendo en puerto 3002`.

## 6. Abrir el frontend
1. Ve a `movie-reviews/frontend/`.
2. Abre el archivo `index.html` en tu navegador (doble clic o usando Live Server de VS Code).

## 7. Usar la aplicación
- Regístrate como nuevo usuario.
- Inicia sesión.
- Explora películas, publica y filtra reseñas.

---

## Diagrama de la Base de Datos (texto)

```
Tabla: users
-----------------------------
| id | username | email | password_hash |
-----------------------------
| PK |   str    | str   |     str      |

Tabla: reviews
-----------------------------------------------------------------------
| id | user_id | movie_id | rating | comment | created_at |
-----------------------------------------------------------------------
| PK |   FK    |   int    |  int   |  text   | timestamp  |
```
- **users.id**: clave primaria
- **reviews.user_id**: clave foránea a users.id
- **reviews.movie_id**: id de película (de TMDB)

---

## Endpoints del Backend

- `POST   /register`   → Registrar usuario (body: username, email, password)
- `POST   /login`      → Login de usuario (body: email, password)
- `POST   /reviews`    → Crear reseña (requiere JWT, body: movieId, rating, comment)
- `GET    /reviews`    → Obtener reseñas (puede filtrar por movieId)

---

## Problemas Encontrados y Soluciones

- **Error: Access denied for user 'root'@'localhost'**
  - Solución: Dejar la contraseña vacía en `.env` si usas XAMPP.
- **Error: EADDRINUSE: address already in use :3002**
  - Solución: Cerrar procesos Node.js colgados o reiniciar la PC.
- **No se guardan usuarios ni reseñas**
  - Solución: Verificar conexión a la base de datos, existencia de tablas y configuración de `.env`.
- **Frontend no conecta con backend**
  - Solución: Revisar que `BACKEND_URL` apunte al puerto correcto y que el backend esté corriendo.

---

## Notas
- Si el puerto 3002 está ocupado, ciérralo o cambia el puerto en `.env` y en `app.js` (constante `BACKEND_URL`).
- El backend debe estar corriendo para que el registro, login y reseñas funcionen.
- Si tienes errores, revisa la terminal donde corre el backend para ver mensajes detallados.

---

¡Listo! Ahora puedes disfrutar de tu plataforma Movie Reviews.