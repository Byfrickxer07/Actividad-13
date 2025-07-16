// app.js: Lógica principal del frontend para Movie Reviews

// Configuración TMDB (pon tu API KEY aquí)
const TMDB_API_KEY = '5259fec2d35e1845491759c6673f7bf5'; // Reemplaza por tu API Key real
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKEND_URL = 'http://localhost:3002'; // Cambia si tu backend corre en otro puerto

// Elementos del DOM
const moviesGrid = document.getElementById('moviesGrid');
const genreFilter = document.getElementById('genreFilter');
const ratingFilter = document.getElementById('ratingFilter');
const reviewModal = document.getElementById('reviewModal');
const reviewForm = document.getElementById('reviewForm');
const closeModalBtn = document.getElementById('closeModalBtn');

// Navbar dinámico
const navbarDiv = document.querySelector('header > div');
function renderNavbar() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  if (navbarDiv) {
    if (token && username) {
      navbarDiv.innerHTML = `
        <span class="mr-4">👤 ${username}</span>
        <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Cerrar sesión</button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Sesión cerrada');
        window.location.href = 'index.html';
      };
    } else {
      navbarDiv.innerHTML = `
        <a href="login.html" class="mr-4 hover:underline">Iniciar sesión</a>
        <a href="register.html" class="hover:underline">Registrarse</a>
      `;
    }
  }
}
renderNavbar();

// Registro de usuario
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };
}

let movies = [];
let genres = [];

// Login de usuario
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        alert('¡Login exitoso!');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };
}

// Cargar géneros desde TMDB
async function loadGenres() {
  if (!genreFilter) return;
  const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`);
  const data = await res.json();
  genres = data.genres;
  genres.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;
    option.textContent = g.name;
    genreFilter.appendChild(option);
  });
}

// Cargar películas populares
async function loadMovies() {
  if (!moviesGrid) return;
  const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`);
  const data = await res.json();
  movies = data.results;
  renderMovies();
}

// Renderizar películas en el grid
function renderMovies() {
  if (!moviesGrid) return;
  moviesGrid.innerHTML = '';
  let filtered = [...movies];
  const genreId = genreFilter ? genreFilter.value : '';
  const minRating = ratingFilter ? Number(ratingFilter.value) : 0;
  if (genreId) filtered = filtered.filter(m => m.genre_ids.includes(Number(genreId)));
  if (minRating) filtered = filtered.filter(m => Math.round(m.vote_average/2) >= minRating);
  if (filtered.length === 0) {
    moviesGrid.innerHTML = '<p class="col-span-full text-center">No se encontraron películas.</p>';
    return;
  }
  filtered.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'bg-white rounded shadow p-3 flex flex-col';
    div.innerHTML = `
      <img src="${movie.poster_path ? TMDB_IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=Sin+Imagen'}" alt="${movie.title}" class="rounded mb-2 h-64 object-cover">
      <h3 class="font-bold text-lg mb-1">${movie.title}</h3>
      <p class="text-sm text-gray-600 mb-2 line-clamp-3">${movie.overview || 'Sin sinopsis.'}</p>
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-1">★</span>
        <span>${(movie.vote_average/2).toFixed(1)} / 5</span>
      </div>
      <button class="mt-auto bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800" data-movieid="${movie.id}">Reseñar</button>
    `;
    moviesGrid.appendChild(div);
  });
}

// Abrir modal de reseña
function openReviewModal(movieId) {
  if (!reviewModal) return;
  reviewModal.classList.remove('hidden');
  document.getElementById('modalMovieId').value = movieId;
}

// Cerrar modal de reseña
function closeReviewModal() {
  if (!reviewModal) return;
  reviewModal.classList.add('hidden');
  reviewForm.reset();
}

// Listeners
if (moviesGrid) {
  moviesGrid.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.movieid) {
      openReviewModal(e.target.dataset.movieid);
    }
  });
}
if (closeModalBtn) closeModalBtn.onclick = closeReviewModal;
if (reviewModal) reviewModal.onclick = e => { if (e.target === reviewModal) closeReviewModal(); };
if (genreFilter) genreFilter.onchange = renderMovies;
if (ratingFilter) ratingFilter.onchange = renderMovies;

// Enviar reseña al backend
if (reviewForm) {
  reviewForm.onsubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para publicar una reseña');
      closeReviewModal();
      return;
    }
    const movieId = document.getElementById('modalMovieId').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    try {
      const res = await fetch(`${BACKEND_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId, rating, comment })
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Reseña enviada y guardada!');
        closeReviewModal();
      } else {
        alert(data.message || 'Error al guardar reseña');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };
}

// Inicializar
if (document.body.contains(document.getElementById('moviesGrid'))) {
  loadGenres();
  loadMovies();
}
