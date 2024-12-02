// Defineerime globaalsed muutujad
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
let toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];

const API_KEY = "api_key=8e6d18d487ad8e90c75fcab44d14ee54";
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');


getMovies(API_URL);

function getMovies(url) {

  fetch(url).then(res => res.json()).then(data => {
    console.log(data.results)
    showMovies(data.results);
  })
}

function showMovies(data) {
  const main = document.getElementById('main');
  if (!main) {
    console.error("Element with ID 'main' not found on this page.");
    return;
  }

  main.innerHTML = '';
  data.forEach(movie => {
    const { title, poster_path, overview } = movie;

    if (!poster_path) {
      console.warn(`No poster available for movie: "${title}"`);
      return;
    }

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <button class="nupp_postril">+</button>
      <div class="dropdown hidden">
        <button class="dropdown-item" onclick="markAsWatched('${title}', '${poster_path}')">Vaadatud</button>
        <button class="dropdown-item" onclick="markAsToWatch('${title}', '${poster_path}')">Vaatamiseks</button>
      </div>
      <img src="${IMG_URL + poster_path}" alt="${title}">
      <div class="movie-info">
          <h3>${title}</h3>
      </div>
      <div class="overview">
          <h3>Overview</h3>
          ${overview}
      </div>`;
    main.appendChild(movieEl);
  });
  setupDropdowns();
}
function setupDropdowns() {
  document.querySelectorAll(".nupp_postril").forEach((button) => {
    const dropdown = button.nextElementSibling;

    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Takistab sündmuse levikut

      // Sulge kõik teised dropdownid
      document.querySelectorAll(".dropdown").forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.add("hidden");
        }
      });

      // Lülita praeguse dropdowni nähtavus
      dropdown.classList.toggle("hidden");
    });
  });

  // Peidame kõik dropdownid, kui klikitakse mujale
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.add("hidden");
    });
  });
}

// Visuaalne kinnitus filmi lisamisel
function showConfirmation(message) {
  const confirmation = document.createElement("div");
  confirmation.classList.add("confirmation");
  confirmation.innerText = message;

  document.body.appendChild(confirmation);
  setTimeout(() => {
    confirmation.remove();
  }, 3000); // Kinnitus kaob 3 sekundi pärast
}

// Täiendatud markeerimise funktsioonid
function markAsWatched(title, poster_path) {
  if (!poster_path) {
    console.error(`Poster path is missing for "${title}"`); // Lisatud logiväljund
    return;
  }

  if (!watchedMovies.some(movie => movie.title === title)) {
    watchedMovies.push({ title, imageSrc: IMG_URL + poster_path }); // Veendu, et IMG_URL on lisatud
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
    alert(`"${title}" märgiti vaadatuks!`);
  } else {
    alert(`"${title}" on juba vaadatud nimekirjas.`);
  }
}

function markAsToWatch(title, poster_path) {
  if (!poster_path) {
    console.error(`Poster path is missing for "${title}"`); // Lisatud logiväljund
    return;
  }

  if (!toWatchMovies.some(movie => movie.title === title)) {
    toWatchMovies.push({ title, imageSrc: IMG_URL + poster_path }); // Veendu, et IMG_URL on lisatud
    localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));
    alert(`"${title}" lisati vaatamise plaani!`);
  } else {
    alert(`"${title}" on juba vaatamise plaanis.`);
  }
}


if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
      getMovies(searchURL + '&query=' + searchTerm);
    } else {
      getMovies(API_URL);
    }
  });
}