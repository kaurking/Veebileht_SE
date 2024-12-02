// ChatGPT - Selle lehe Javascript 

window.onload = () => {
  const watchedList = document.getElementById("watched-list"); // Leidke 'vaadatud' nimekiri
  const toWatchList = document.getElementById("to-watch-list"); // Leidke 'plaanis' nimekiri

  if (watchedList) {
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || []; // Lae vaadatud filmid localStorage'ist
    displayMovies(watchedList, watchedMovies, "Siin pole veel ühtegi vaadatud filmi."); // Kuvage vaadatud filmid
  }

  if (toWatchList) {
    const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || []; // Lae vaatamiseks lisatud filmid
    displayMovies(toWatchList, toWatchMovies, "Siin pole veel ühtegi vaatamiseks lisatud filmi.", true); // Kuvage vaatamiseks lisatud filmid
  }
};

// Funktsioon filmide kuvamiseks
function displayMovies(container, movies, emptyMessage, isToWatch = false) {
  container.innerHTML = ""; // Tühjenda konteiner enne filmide lisamist

  if (movies.length === 0) {
    container.innerHTML = `<p>${emptyMessage}</p>`; // Kui filme pole, kuva tühi sõnum
    return;
  }

  movies.forEach((movie, index) => {
    if (!movie.imageSrc) {
      console.error(`Missing image source for movie: "${movie.title}"`); // Kui filmi pilt puudub, kuva veateade
      return;
    }

    const movieEl = document.createElement("div"); // Loo filmielement
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${movie.imageSrc}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
      </div>`;

    if (isToWatch) {
      // Lisa nupud ainult "plaanis" lehele
      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("buttons-container");

      const watchedButton = document.createElement("button"); // Nupp "Vaadatud"
      watchedButton.innerText = "Vaadatud";
      watchedButton.addEventListener("click", () => moveToWatched(index)); // Kinnita film "vaadatud" nimekirja

      const deleteButton = document.createElement("button"); // Nupp "Kustuta"
      deleteButton.innerText = "Kustuta";
      deleteButton.addEventListener("click", () => deleteFromToWatch(index)); // Kustuta film "plaanis" nimekirjast

      buttonsContainer.appendChild(watchedButton);
      buttonsContainer.appendChild(deleteButton);
      movieEl.appendChild(buttonsContainer);
    }

    container.appendChild(movieEl); // Lisa film konteinerisse
  });
}

// Funktsioon filmi liigutamiseks "vaadatud" lehele
function moveToWatched(index) {
  const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
  const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];

  const movie = toWatchMovies.splice(index, 1)[0]; // Eemalda film 'plaanis' nimekirjast
  watchedMovies.push(movie); // Lisa film 'vaadatud' nimekirja

  localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies)); // Salvesta uuendatud 'plaanis' nimekiri
  localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies)); // Salvesta uuendatud 'vaadatud' nimekiri

  showConfirmation(`"${movie.title}" liigutati vaadatud nimekirja.`); // Kuvage kinnitus, et film on liigutatud
  reloadToWatchList(); // Värskenda vaatamiseks nimekirja
}

// Funktsioon filmi kustutamiseks "plaanis" lehelt
function deleteFromToWatch(index) {
  const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
  const movie = toWatchMovies.splice(index, 1)[0]; // Eemalda film 'plaanis' nimekirjast

  localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies)); // Salvesta uuendatud 'plaanis' nimekiri

  showConfirmation(`"${movie.title}" kustutati vaatamise plaanist.`); // Kuvage kinnitus filmi kustutamise kohta
  reloadToWatchList(); // Värskenda vaatamiseks nimekirja
}

// Funktsioon vaatamiseks nimekirja värskendamiseks
function reloadToWatchList() {
  const toWatchList = document.getElementById("to-watch-list");
  if (toWatchList) {
    const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
    displayMovies(toWatchList, toWatchMovies, "Siin pole veel ühtegi vaatamiseks lisatud filmi.", true); // Kuvage uuesti nimekiri
  }
}

// Kinnituste funktsioon
function showConfirmation(message) {
  const confirmation = document.createElement("div");
  confirmation.classList.add("confirmation"); // Loo kinnitus
  confirmation.innerText = message; // Kuva kinnitus sõnum

  document.body.appendChild(confirmation); // Lisa kinnitus lehele
  setTimeout(() => {
    confirmation.remove(); // Eemalda kinnitus pärast 3 sekundit
  }, 3000);
}
