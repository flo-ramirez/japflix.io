const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const lista = document.getElementById('lista');
const contenedorPeliculaSeleccionada = document.getElementById('peliculaSeleccionada');
const tituloPelicula = document.getElementById('tituloPelicula');
const overviewPelicula = document.getElementById('overviewPelicula');
const generosPelicula = document.getElementById('generosPelicula');
const cerrarDetalle = document.getElementById('cerrarDetalle');

let peliculas = [];

const cargarPeliculas = async () => {
  try {
    const response = await fetch(API_URL);
    peliculas = await response.json();
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }
};

const buscarCoincidencia = (pelicula, filtro) => {
  const textoBusqueda = filtro.toLowerCase();
  return pelicula.title && pelicula.title.toLowerCase().includes(textoBusqueda)
    || pelicula.genres && pelicula.genres.some(genero => genero.name.toLowerCase().includes(textoBusqueda))
    || pelicula.tagline && pelicula.tagline.toLowerCase().includes(textoBusqueda)
    || pelicula.overview && pelicula.overview.toLowerCase().includes(textoBusqueda);
};

const obtenerPorcentajeEstrellas = (vote_average) => (vote_average / 10) * 100;

const mostrarPeliculas = (filtro = '') => {
  lista.innerHTML = '';
  const peliculasFiltradas = peliculas.filter(pelicula => buscarCoincidencia(pelicula, filtro));

  if (peliculasFiltradas.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-white bg-danger">No se encontraron películas</li>';
  } else {
    peliculasFiltradas.forEach(pelicula => {
      const item = document.createElement('li');
      item.classList.add('list-group-item');
      item.dataset.id = pelicula.id;

      const porcentajeEstrellas = obtenerPorcentajeEstrellas(pelicula.vote_average);
      item.innerHTML = `
        <strong>${pelicula.title}</strong><br>
        <em>${pelicula.tagline || 'Sin tagline'}</em><br>
        <div class="stars-outer">
          <div class="stars-inner" style="width: ${porcentajeEstrellas}%;"></div>
        </div>
      `;

      item.addEventListener('click', () => {
        mostrarDetallePelicula(pelicula);
      });

      lista.appendChild(item);
    });
  }
};

const mostrarDetallePelicula = (pelicula) => {
  tituloPelicula.textContent = pelicula.title;
  overviewPelicula.textContent = pelicula.overview || 'No hay descripción disponible.';
  generosPelicula.innerHTML = pelicula.genres.map(g => `<li>${g.name}</li>`).join('');

  contenedorPeliculaSeleccionada.classList.add('mostrar');
};

cerrarDetalle.addEventListener('click', () => {
  contenedorPeliculaSeleccionada.classList.remove('mostrar');
});

btnBuscar.addEventListener('click', () => {
  const filtro = inputBuscar.value;
  if (peliculas.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-white bg-warning">Cargando películas, por favor espera...</li>';
  } else {
    mostrarPeliculas(filtro);
  }
});

window.addEventListener('load', cargarPeliculas);
