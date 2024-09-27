// URL del archivo JSON
const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

// Elementos del DOM
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const lista = document.getElementById('lista');
const contenedorPeliculaSeleccionada = document.getElementById('peliculaSeleccionada');
const tituloPelicula = document.getElementById('tituloPelicula');
const overviewPelicula = document.getElementById('overviewPelicula');
const generosPelicula = document.getElementById('generosPelicula');
const cerrarDetalle = document.getElementById('cerrarDetalle');

// Variable para almacenar las películas cargadas
let peliculas = [];

// Función para cargar las películas del JSON
const cargarPeliculas = async () => {
  try {
    const response = await fetch(API_URL);
    peliculas = await response.json();  // Guardar las películas en la variable global
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }
};

// Función para buscar coincidencias en título, géneros, tagline u overview
const buscarCoincidencia = (pelicula, filtro) => {
  const textoBusqueda = filtro.toLowerCase();
  
  // Coincidencia en título
  const coincideEnTitulo = pelicula.title && pelicula.title.toLowerCase().includes(textoBusqueda);

  // Coincidencia en géneros (es un array, así que recorremos cada género)
  const coincideEnGeneros = pelicula.genres && pelicula.genres.some(genero => genero.name.toLowerCase().includes(textoBusqueda));

  // Coincidencia en tagline
  const coincideEnTagline = pelicula.tagline && pelicula.tagline.toLowerCase().includes(textoBusqueda);

  // Coincidencia en overview (descripción)
  const coincideEnOverview = pelicula.overview && pelicula.overview.toLowerCase().includes(textoBusqueda);

  // Retorna true si encuentra coincidencia en cualquiera de los atributos
  return coincideEnTitulo || coincideEnGeneros || coincideEnTagline || coincideEnOverview;
};

// Función para convertir vote_average a porcentaje de estrellas
const obtenerPorcentajeEstrellas = (vote_average) => {
  const maxStars = 5; // Total de estrellas
  const maxVote = 10; // Escala máxima de vote_average
  return (vote_average / maxVote) * 100; // Porcentaje
};

// Función para mostrar las películas en la lista con title, tagline y estrellas de vote_average
const mostrarPeliculas = (filtro = '') => {
  lista.innerHTML = ''; // Limpiar lista
  const peliculasFiltradas = peliculas.filter(pelicula => 
    buscarCoincidencia(pelicula, filtro)
  );

  if (peliculasFiltradas.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-white bg-danger">No se encontraron películas</li>';
  } else {
    peliculasFiltradas.forEach(pelicula => {
      const item = document.createElement('li');
      item.classList.add('list-group-item');

      const porcentajeEstrellas = obtenerPorcentajeEstrellas(pelicula.vote_average);
      item.innerHTML = `
        <strong>${pelicula.title}</strong><br>
        <em>${pelicula.tagline || 'Sin tagline'}</em><br>
        <div class="stars-outer">
          <div class="stars-inner" style="width: ${porcentajeEstrellas}%;"></div>
        </div>
      `;

      // Agregar un evento de click para mostrar los detalles en el contenedor superior
      item.addEventListener('click', () => {
        mostrarDetallePelicula(pelicula);
      });

      lista.appendChild(item);
    });
  }
};

// Función para mostrar los detalles de la película seleccionada en el contenedor superior
const mostrarDetallePelicula = (pelicula) => {
  tituloPelicula.textContent = pelicula.title;
  overviewPelicula.textContent = pelicula.overview || 'No hay descripción disponible.';
  generosPelicula.innerHTML = pelicula.genres.map(g => `<li>${g.name}</li>`).join('');

  // Mostrar más detalles en el desplegable
  document.getElementById('anioLanzamiento').textContent = pelicula.release_date.split('-')[0]; // Solo el año
  document.getElementById('duracion').textContent = pelicula.runtime || 'No disponible';
  document.getElementById('presupuesto').textContent = pelicula.budget ? pelicula.budget.toLocaleString() : 'No disponible';
  document.getElementById('ganancias').textContent = pelicula.revenue ? pelicula.revenue.toLocaleString() : 'No disponible';

  // Mostrar el contenedor superior
  contenedorPeliculaSeleccionada.style.display = 'block';
};

// Evento para cerrar el contenedor superior
cerrarDetalle.addEventListener('click', () => {
  contenedorPeliculaSeleccionada.style.display = 'none';
});

// Evento para buscar películas
btnBuscar.addEventListener('click', () => {
  const filtro = inputBuscar.value;
  if (peliculas.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-white bg-warning">Cargando películas, por favor espera...</li>';
  } else {
    mostrarPeliculas(filtro);
  }
});

// Cargar las películas cuando se carga la página
window.addEventListener('load', cargarPeliculas);
