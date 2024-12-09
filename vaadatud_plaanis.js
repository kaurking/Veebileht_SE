// Kood tehtud ChatGPT-ga
// Kui leht on täielikult laadinud
window.onload = () => {
    const watchedList = document.getElementById("watched-list"); // Vaadatud filmide konteiner
    const toWatchList = document.getElementById("to-watch-list"); // Vaatamiseks lisatud filmide konteiner

    // Kui leht sisaldab "watched-list" elementi, laadi vaadatud filmid
    if (watchedList) {
        const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Loe vaadatud filme localStorage'ist
        displayMovies(watchedList, watchedMovies, "Siin pole veel ühtegi vaadatud filmi."); // Kuvab vaadatud filmid
    }

    // Kui leht sisaldab "to-watch-list" elementi, laadi vaatamiseks lisatud filmid
    if (toWatchList) {
        const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Loe vaatamiseks lisatud filme localStorage'ist
        displayMovies(toWatchList, toWatchMovies, "Siin pole veel ühtegi vaatamiseks lisatud filmi.", true); // Kuvab vaatamiseks filmid
    }
};

// Funktsioon filmide kuvamiseks antud konteineris
function displayMovies(container, movies, emptyMessage, isToWatch = false) {
    container.innerHTML = ""; // Tühjenda konteiner enne sisu lisamist

    // Kui filme pole, näita vastavat sõnumit
    if (movies.length === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    // Loo iga filmi jaoks HTML-elemendid
    movies.forEach((movie, index) => {
        // Kontrolli, kas filmi pilditee on olemas
        if (!movie.imageSrc) {
            console.error(`Missing image source for movie: "${movie.title}"`); // Kuvab vea konsoolis
            return;
        }

        const movieEl = document.createElement("div"); // Loo konteiner ühe filmi jaoks
        movieEl.classList.add("movie"); // Lisa klass stiilide rakendamiseks
        movieEl.innerHTML = `
            <img src="${movie.imageSrc}" alt="${movie.title}"> 
            <div class="movie-info">
                <h3>${movie.title}</h3>
            </div>`;

        // Kui leht on "vaadatud.html", lisa reitinguväli
        if (window.location.pathname.includes("vaadatud.html")) {
            movieEl.innerHTML += `
            <div class="rating-container">
                <input type="number" class="rating" id="rating-${index}" min="1" max="5" 
                       value="${movie.rating || ''}" placeholder="Rate" 
                       onchange="updateRating(${index}, this.value)">
            </div>`;
        }

        // Kui leht on "plaanis.html", lisa nupud
        if (isToWatch) {
            const buttonsContainer = document.createElement("div"); // Nuppude konteiner
            buttonsContainer.classList.add("buttons-container");

            // Lisa "Vaadatud" nupp
            const watchedButton = document.createElement("button");
            watchedButton.innerText = "Vaadatud";
            watchedButton.onclick = () => moveToWatched(index);

            // Lisa "Kustuta" nupp
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Kustuta";
            deleteButton.onclick = () => deleteFromToWatch(index);

            // Lisa nupud konteinerisse
            buttonsContainer.appendChild(watchedButton);
            buttonsContainer.appendChild(deleteButton);
            movieEl.appendChild(buttonsContainer);
        }

        container.appendChild(movieEl); // Lisa filmi element konteinerisse
    });
}

// Funktsioon filmi liigutamiseks "vaadatud" nimekirja
function moveToWatched(index) {
    const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamiseks filmid
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid

    const movie = toWatchMovies.splice(index, 1)[0]; // Eemalda film vaatamise plaanist
    watchedMovies.push(movie); // Lisa see vaadatud nimekirja

    // Salvesta uuendatud nimekirjad localStorage'i
    localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));

    alert(`"${movie.title}" liigutati vaadatud nimekirja.`); // Kuvab kinnituse
    window.location.reload(); // Värskenda lehte, et muudatused rakenduksid
}

// Funktsioon filmi kustutamiseks "plaanis" nimekirjast
function deleteFromToWatch(index) {
    const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamiseks filmid
    const movie = toWatchMovies.splice(index, 1)[0]; // Eemalda film nimekirjast

    localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies)); // Salvesta uuendatud nimekiri
    alert(`"${movie.title}" kustutati vaatamise plaanist.`); // Kuvab kinnituse
    window.location.reload(); // Värskenda lehte, et muudatused rakenduksid
}

// Funktsioon reitingu uuendamiseks "vaadatud" nimekirjas
function updateRating(index, value) {
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid
    if (watchedMovies[index]) {
        watchedMovies[index].rating = value; // Uuenda filmi reitingut
        localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies)); // Salvesta muudatused localStorage'i
    }
}