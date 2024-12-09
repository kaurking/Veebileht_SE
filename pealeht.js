// Kood tehtud koos video: https://youtu.be/9Bvt6BFf6_U ning ChatGPT-ga
// Defineerime globaalsed muutujad
let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid localStorage'ist või alusta tühja nimekirjaga
let toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamise plaanitud filmid localStorage'ist või alusta tühja nimekirjaga

// API võtmed ja URL-id
const API_KEY = "api_key=8e6d18d487ad8e90c75fcab44d14ee54"; // Filmide API võti
const BASE_URL = 'https://api.themoviedb.org/3'; // Filmide API baas-URL
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY; // Populaarsete filmide päringu URL
const IMG_URL = "https://image.tmdb.org/t/p/w500"; // Filmide postrite URL
const searchURL = BASE_URL + '/search/movie?' + API_KEY; // Filmide otsingu URL

// Anime API URL-id
const ANIME_BASE_URL = "https://api.jikan.moe/v4"; // Anime API baas-URL
const ANIME_SEARCH_URL = `${ANIME_BASE_URL}/anime?q=`; // Anime otsingu URL

// DOM elemendid
const main = document.getElementById('main'); // Peamine sisu konteiner
const form = document.getElementById('form'); // Otsingu vorm
const search = document.getElementById('search'); // Otsinguväli

// Laadime algse sisu (populaarsed filmid ja animed)
fetchDefaultContent();

// Laadib populaarsed filmid ja animed API-st
async function fetchDefaultContent() {
    try {
        main.innerHTML = '<h2>Loading...</h2>'; // Kuva laadimisindikaator

        // Kutsume paralleelselt mõlemad API-d (filmid ja animed)
        const [moviesResponse, animeResponse] = await Promise.all([
            fetch(API_URL), // Filmide API päring
            fetch(`${ANIME_BASE_URL}/top/anime`) // Animede API päring
        ]);

        // Parseerime API vastused JSON formaadis
        const moviesData = await moviesResponse.json();
        const animeData = await animeResponse.json();

        // Töötleme filmid
        const movies = moviesData.results.map(movie => ({
            title: movie.title,
            poster_path: movie.poster_path ? IMG_URL + movie.poster_path : null, // Kontrollime, kas poster eksisteerib
            overview: movie.overview || "No overview available.", // Asendus tekst, kui puudub
            type: "movie"
        }));

        // Töötleme animed
        const animes = animeData.data.map(anime => ({
            title: anime.title,
            poster_path: anime.images.jpg.image_url || null, // Kontrollime, kas poster eksisteerib
            overview: anime.synopsis || "No synopsis available.", // Asendus tekst, kui puudub
            type: "anime"
        }));

        // Kombineerime tulemused
        const combinedResults = [...movies, ...animes];
        displayCombinedResults(combinedResults); // Kuvame tulemused

    } catch (error) {
        console.error("Error fetching default content:", error); // Veateade
    }
}

// Otsib ja kuvab filmid ja animed vastavalt otsinguterminile
async function fetchAndDisplayCombined(searchTerm) {
    try {
        // Kutsume paralleelselt mõlemad otsingu API-d
        const [moviesResponse, animeResponse] = await Promise.all([
            fetch(searchURL + '&query=' + encodeURIComponent(searchTerm)),
            fetch(`${ANIME_SEARCH_URL}${encodeURIComponent(searchTerm)}`)
        ]);

        // Parseerime vastused
        const moviesData = await moviesResponse.json();
        const animeData = await animeResponse.json();

        // Töötleme andmed
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
        displayCombinedResults(combinedResults); // Kuvame otsingutulemused

    } catch (error) {
        console.error("Error fetching combined data:", error); // Veateade
    }
}

// Kuvab kombineeritud tulemused DOM-is
function displayCombinedResults(data) {
    if (!main) {
        console.error("Element with ID 'main' not found."); // Kontrollime, kas main-element eksisteerib
        return;
    }

    main.innerHTML = ''; // Tühjendame sisu

    data.forEach(item => {
        const { title, poster_path, overview, type } = item;

        if (!poster_path) {
            console.warn(`No poster available for ${type}: "${title}"`); // Kui poster puudub
            return;
        }

        // Loome uue elemendi filmi/anime kuvamiseks
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
        main.appendChild(itemEl); // Lisame elemendi DOM-i
    });

    setupDropdowns(); // Seadistame dropdown menüüd
}

// Dropdown-menüüde haldamine
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

            dropdown.classList.toggle("hidden"); // Ava või sulge dropdown
        });
    });

    // Peidame kõik dropdownid, kui klikitakse mujale
    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown").forEach((dropdown) => {
            dropdown.classList.add("hidden");
        });
    });
}

// Kuvab kinnitusmõtte visuaalselt
function showConfirmation(message) {
    const confirmation = document.createElement("div");
    confirmation.classList.add("confirmation");
    confirmation.innerText = message;

    document.body.appendChild(confirmation); // Kuvame teate
    setTimeout(() => {
        confirmation.remove(); // Eemaldame teate pärast 3 sekundit
    }, 3000);
}

// Märgib filmi/anime vaadatud nimekirja
function markAsWatched(title, poster_path) {
    if (!poster_path) {
        console.error(`Poster path is missing for "${title}"`); // Kontrollime, kas poster on olemas
        return;
    }

    if (!watchedMovies.some(movie => movie.title === title)) {
        watchedMovies.push({ title, imageSrc: poster_path }); // Lisa nimekirja
        localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies)); // Salvesta localStorage'i
        showConfirmation(`"${title}" lisati vaadatud nimekirja.`); // Kuvame kinnitust
    } else {
        showConfirmation(`"${title}" on juba vaadatud nimekirjas.`); // Teade, kui juba eksisteerib
    }
}

// Märgib filmi/anime vaatamiseks nimekirja
function markAsToWatch(title, poster_path) {
    if (!poster_path) {
        console.error(`Poster path is missing for "${title}"`); // Kontrollime, kas poster on olemas
        return;
    }

    if (!toWatchMovies.some(movie => movie.title === title)) {
        toWatchMovies.push({ title, imageSrc: poster_path }); // Lisa nimekirja
        localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies)); // Salvesta localStorage'i
        showConfirmation(`"${title}" lisati vaatamise plaani!`); // Kuvame kinnitust
    } else {
        alert(`"${title}" on juba vaatamise plaanis.`); // Teade, kui juba eksisteerib
    }
}

// Käivitab otsinguvormi sündmuse
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Takistab lehe uuesti laadimist
        const searchTerm = search.value.trim();

        if (searchTerm) {
            await fetchAndDisplayCombined(searchTerm); // Lae otsingutulemused
        } else {
            await fetchDefaultContent(); // Kuvame vaikesisu
        }
    });
}

// Kuvab algsed populaarsed filmid ja animed esmakordselt
fetchDefaultContent();
