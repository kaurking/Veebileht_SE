// https://youtu.be/9Bvt6BFf6_U - videost võtsime mõne osa sellest koodist
// ChatGPT - ülejäänud javascript

// Defineerime globaalsed muutujad
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid localStorage'ist või tühjenda, kui pole
let toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamiseks lisatud filmid localStorage'ist või tühjenda, kui pole

const API_KEY = "api_key=8e6d18d487ad8e90c75fcab44d14ee54"; // API võtme määramine
const BASE_URL = 'https://api.themoviedb.org/3'; // The Movie Database API baas URL
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY; // URL, et leida populaarseid filme
const IMG_URL = "https://image.tmdb.org/t/p/w500"; // Piltide baas URL
const searchURL = BASE_URL + '/search/movie?' + API_KEY; // URL filmide otsimiseks

const main = document.getElementById('main'); // Peamine konteiner filmide kuvamiseks
const form = document.getElementById('form'); // Otsinguvormi element
const search = document.getElementById('search'); // Otsingu sisestusväli

getMovies(API_URL); // Kutsu filmi laadimise funktsioon esmakordselt, et kuvada populaarsed filmid

function getMovies(url) {
  fetch(url) // Tee API päring
    .then(res => res.json()) // Muuda vastus JSON-iks
    .then(data => {
      console.log(data.results); // Kuvage saadud andmed konsoolis
      showMovies(data.results); // Kuvage filmid lehe peal
    })
}

function showMovies(data) {
  const main = document.getElementById('main');
  if (!main) {
    console.error("Element with ID 'main' not found on this page."); // Kui element ei leita, kuvage veateade
    return;
  }

  main.innerHTML = ''; // Tühjenda peamine konteiner enne uute filmide kuvamist
  data.forEach(movie => {
    const { title, poster_path, overview } = movie;

    if (!poster_path) {
      console.warn(`No poster available for movie: "${title}"`); // Kui pilt puudub, kuvage hoiatus
      return;
    }

    const movieEl = document.createElement("div"); // Loo iga filmi jaoks uus div element
    movieEl.classList.add("movie"); // Lisage klass nimega "movie"
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
    main.appendChild(movieEl); // Lisa film peamisele konteinerile
  });
  setupDropdowns(); // Käivita dropdown menüüde seaded
}

function setupDropdowns() {
  // Seadistage iga filmi "nupp_postril" jaoks dropdown menüü
  document.querySelectorAll(".nupp_postril").forEach((button) => {
    const dropdown = button.nextElementSibling;

    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Takistab sündmuse levikut
      document.querySelectorAll(".dropdown").forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.add("hidden"); // Peida kõik teised menüüd
        }
      });

      dropdown.classList.toggle("hidden"); // Lülita aktuaalne menüü nähtavaks/peidetuks
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.add("hidden"); // Peida kõik menüüd, kui klõpsatakse väljaspool
    });
  });
}

// Visuaalne kinnitus filmi lisamisel
function showConfirmation(message) {
  const confirmation = document.createElement("div");
  confirmation.classList.add("confirmation"); // Loo kinnitus
  confirmation.innerText = message; // Sisesta sõnum

  document.body.appendChild(confirmation); // Lisa kinnitus lehe kehale
  setTimeout(() => {
    confirmation.remove(); // Eemalda kinnitus pärast 3 sekundit
  }, 3000);
}

// Täiendatud markeerimise funktsioonid
function markAsWatched(title, poster_path) {
  if (!poster_path) {
    console.error(`Poster path is missing for "${title}"`); // Kui pilt puudub, kuva veateade
    return;
  }

  // Loeme uuesti "vaadatud" nimekirja
  watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];

  const isAlreadyWatched = watchedMovies.some(movie => movie.title === title); // Kontrollige, kas film on juba vaadatud nimekirjas

  if (!isAlreadyWatched) {
    // Kui filmi pole veel nimekirjas
    watchedMovies.push({ title, imageSrc: IMG_URL + poster_path }); // Lisa film vaadatud nimekirja
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies)); // Salvesta nimekiri localStorage'isse
    showConfirmation(`"${title}" lisati vaadatud nimekirja.`); // Edu teavitus
  } else {
    // Kui film on juba nimekirjas
    showConfirmation(`"${title}" on juba vaadatud nimekirjas.`); // Hoiatus, et film on juba olemas
  }
}

function markAsToWatch(title, poster_path) {
  if (!poster_path) {
    console.error(`Poster path is missing for "${title}"`); // Kui pilt puudub, kuva veateade
    return;
  }

  if (!toWatchMovies.some(movie => movie.title === title)) {
    // Kui filmi pole veel "plaanis" nimekirjas
    toWatchMovies.push({ title, imageSrc: IMG_URL + poster_path }); // Lisa film vaatamiseks nimekirja
    localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies)); // Salvesta nimekiri localStorage'isse
    showConfirmation(`"${title}" lisati vaatamise plaani!`); // Teavitus, et film on lisatud vaatamiseks
  } else {
    alert(`"${title}" on juba vaatamise plaanis.`); // Hoiatus, kui film on juba vaatamisplaanis
  }
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Väldi vormi vaikimisi saatmist
    const searchTerm = search.value; // Otsi kasutaja sisestatud otsinguterminit

    if (searchTerm) {
      getMovies(searchURL + '&query=' + searchTerm); // Kui otsinguterminit on sisestatud, otsi filme
    } else {
      getMovies(API_URL); // Kui otsinguterminit pole sisestatud, kuva kõik populaarsed filmid
    }
  });
}
