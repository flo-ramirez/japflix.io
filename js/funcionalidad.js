// URL del archivo JSON
const API_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';

// Elementos del DOM
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const lista = document.getElementById('lista');

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
      lista.appendChild(item);
    });
  }
};

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
