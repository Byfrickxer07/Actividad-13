# Movie Reviews

Plataforma web FullStack para explorar, filtrar y reseñar películas populares usando la API de TMDB.

## Estructura del Proyecto

```
movie-reviews/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── styles.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   ├── models/
│   └── middleware/
└── README.md
```

## Requisitos
- Node.js
- MySQL
- Tailwind CSS (CDN)
- API Key de TMDB

## Instalación
1. Instala dependencias backend:
   ```bash
   cd backend
   npm install
   ```
2. Configura la base de datos MySQL (ver más abajo).
3. Inicia el backend:
   ```bash
   npm start
   ```
4. Abre `frontend/index.html` en tu navegador.

## Base de Datos

Crea la base de datos y tablas con este SQL:

```sql
CREATE DATABASE IF NOT EXISTS movie_reviews;
USE movie_reviews;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Backend
- `POST /register` — Registro de usuarios
- `POST /login` — Login y obtención de JWT
- `POST /reviews` — Publicar reseña (requiere JWT)
- `GET /reviews/:movieId` — Obtener reseñas de una película

---
