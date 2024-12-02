//Anime api integreerimine on ChatGPT-ga kirjutatud



// Defineerime globaalsed muutujad
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
let toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];

//Filmide API-d
const API_KEY = "api_key=8e6d18d487ad8e90c75fcab44d14ee54";
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

// Anime API-d
const ANIME_BASE_URL = "https://api.jikan.moe/v4";
const ANIME_SEARCH_URL = `${ANIME_BASE_URL}/anime?q=`;

// DOM elemendid
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// võtab suvalised filmid ja animed
fetchDefaultContent();

// võtab suvalised filmid ja animed
async function fetchDefaultContent() {
    try {
        const main = document.getElementById('main');
        main.innerHTML = '<h2>Loading...</h2>'; // korraks display-b enne kui ära laeb

        // fetch animed ja filmid
        const [moviesResponse, animeResponse] = await Promise.all([
            fetch(API_URL), // Filmid endpoint
            fetch(`${ANIME_BASE_URL}/top/anime`) // Animede endpoint
        ]);

        const moviesData = await moviesResponse.json();
        const animeData = await animeResponse.json();

        const movies = moviesData.results.map(movie => ({
            title: movie.title,
            poster_path: movie.poster_path ? IMG_URL + movie.poster_path : null,
            overview: movie.overview || "No overview available.",
            type: "movie"
        }));

        const animes = animeData.data.map(anime => ({
            title: anime.title,
            poster_path: anime.images.jpg.image_url || null,
            overview: anime.synopsis || "No synopsis available.",
            type: "anime"
        }));

        const combinedResults = [...movies, ...animes];
        displayCombinedResults(combinedResults);

    } catch (error) {
        console.error("Error fetching default content:", error);
    }
}


async function fetchAndDisplayCombined(searchTerm) {
    try {

        const [moviesResponse, animeResponse] = await Promise.all([
            fetch(searchURL + '&query=' + encodeURIComponent(searchTerm)),
            fetch(`${ANIME_SEARCH_URL}${encodeURIComponent(searchTerm)}`)
        ]);

        const moviesData = await moviesResponse.json();
        const animeData = await animeResponse.json();

        const movies = moviesData.results.map(movie => ({
            title: movie.title,
            poster_path: movie.poster_path ? IMG_URL + movie.poster_path : null,
            overview: movie.overview || "No overview available.",
            type: "movie"
        }));

        const animes = animeData.data.map(anime => ({
            title: anime.title,
            poster_path: anime.images.jpg.image_url || null,
            overview: anime.synopsis || "No synopsis available.",
            type: "anime"
        }));

        const combinedResults = [...movies, ...animes];
        displayCombinedResults(combinedResults);

    } catch (error) {
        console.error("Error fetching combined data:", error);
    }
}

function displayCombinedResults(data) {
    if (!main) {
        console.error("Element with ID 'main' not found.");
        return;
    }

    main.innerHTML = '';

    data.forEach(item => {
        const { title, poster_path, overview, type } = item;

        if (!poster_path) {
            console.warn(`No poster available for ${type}: "${title}"`);
            return;
        }
// üks filmi aken
        const itemEl = document.createElement("div");
        itemEl.classList.add("movie");
        itemEl.innerHTML = `
            <button class="nupp_postril">+</button>
            <div class="dropdown hidden">
                <button class="dropdown-item" onclick="markAsWatched('${title}', '${poster_path}')">Vaadatud</button>
                <button class="dropdown-item" onclick="markAsToWatch('${title}', '${poster_path}')">Vaatamiseks</button>
            </div>
            <img src="${poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>`;
        main.appendChild(itemEl);
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

// kui form submittib
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const searchTerm = search.value.trim(); // pmst python .strip()

        if (searchTerm) {
            await fetchAndDisplayCombined(searchTerm); // kuva seach results
        } else {
            await fetchDefaultContent(); // kuva suva filmid ja animed
        }
    });
}

// Lisa vaadatud nimekirja
function markAsWatched(title, poster_path) {
  if (!poster_path) {
      console.error(`Poster path is missing for "${title}"`); // Lisatud logiväljund
      return;
  }

  if (!watchedMovies.some(movie => movie.title === title)) {
      watchedMovies.push({ title, imageSrc: poster_path });
      localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies)); // Veendu, et IMG_URL on lisatud
      alert(`"${title}" marked as watched!`);
  } else {
      alert(`"${title}" is already in the watched list.`);
  }
}
function markAsToWatch(title, poster_path) {
  if (!poster_path) {
      console.error(`Poster path is missing for "${title}"`);
      return;
  }

  if (!toWatchMovies.some(movie => movie.title === title)) {
      toWatchMovies.push({ title, imageSrc: poster_path });
      localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));
      alert(`"${title}" added to the to-watch list!`);
  } else {
      alert(`"${title}" is already in the to-watch list.`);
  }
}