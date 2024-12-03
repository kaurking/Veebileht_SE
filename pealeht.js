// Defineerime globaalsed muutujad
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid localStorage'ist või tühjenda, kui pole
let toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamiseks lisatud filmid localStorage'ist või tühjenda, kui pole

// Filmide API-d
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

// Fetch default content (popular movies and anime)
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

// Fetch search results (movies and anime)
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

// Display results
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

// Setup dropdown for options
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
    }, 3000);
}

// Lisa vaadatud nimekirja
function markAsWatched(title, poster_path) {
    if (!poster_path) {
        console.error(`Poster path is missing for "${title}"`);
        return;
    }

    if (!watchedMovies.some(movie => movie.title === title)) {
        watchedMovies.push({ title, imageSrc: poster_path });
        localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
        showConfirmation(`"${title}" lisati vaadatud nimekirja.`); // Show confirmation message
    } else {
        showConfirmation(`"${title}" on juba vaadatud nimekirjas.`);
    }
}

// Lisa vaatamiseks nimekirja
function markAsToWatch(title, poster_path) {
    if (!poster_path) {
        console.error(`Poster path is missing for "${title}"`);
        return;
    }

    if (!toWatchMovies.some(movie => movie.title === title)) {
        toWatchMovies.push({ title, imageSrc: poster_path });
        localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));
        showConfirmation(`"${title}" lisati vaatamise plaani!`); // Show confirmation message
    } else {
        alert(`"${title}" on juba vaatamise plaanis.`);
    }
}

// kui form submittib
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const searchTerm = search.value.trim();

        if (searchTerm) {
            await fetchAndDisplayCombined(searchTerm); // kuva seach results
        } else {
            await fetchDefaultContent(); // kuva suva filmid ja animed
        }
    });
}

// Kutsu filmi laadimise funktsioon esmakordselt, et kuvada populaarsed filmid
fetchDefaultContent();
