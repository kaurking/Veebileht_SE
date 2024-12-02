window.onload = () => {
  const watchedList = document.getElementById("watched-list");
  const toWatchList = document.getElementById("to-watch-list");

  if (watchedList) {
      const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
      displayMovies(watchedList, watchedMovies, "Siin pole veel ühtegi vaadatud filmi.");
  }

  if (toWatchList) {
      const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
      displayMovies(toWatchList, toWatchMovies, "Siin pole veel ühtegi vaatamiseks lisatud filmi.", true);
  }
};

// Funktsioon filmide kuvamiseks
function displayMovies(container, movies, emptyMessage, isToWatch = false) {
  container.innerHTML = ""; // Tühjenda konteiner

  if (movies.length === 0) {
      container.innerHTML = `<p>${emptyMessage}</p>`;
      return;
  }

  movies.forEach((movie, index) => {
      if (!movie.imageSrc) {
          console.error(`Missing image source for movie: "${movie.title}"`); // Veateade
          return;
      }

      const movieEl = document.createElement("div");
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

          const watchedButton = document.createElement("button");
          watchedButton.innerText = "Vaadatud";
          watchedButton.onclick = () => moveToWatched(index);

          const deleteButton = document.createElement("button");
          deleteButton.innerText = "Kustuta";
          deleteButton.onclick = () => deleteFromToWatch(index);

          buttonsContainer.appendChild(watchedButton);
          buttonsContainer.appendChild(deleteButton);
          movieEl.appendChild(buttonsContainer);
      }

      container.appendChild(movieEl);
  });
}

// Funktsioon filmi liigutamiseks "vaadatud" lehele
function moveToWatched(index) {
  const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
  const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];

  const movie = toWatchMovies.splice(index, 1)[0];
  watchedMovies.push(movie);

  localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));
  localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));

  alert(`"${movie.title}" liigutati vaadatud nimekirja.`);
  window.location.reload(); // Värskenda lehte, et muudatused kajastuksid
}

// Funktsioon filmi kustutamiseks "plaanis" lehelt
function deleteFromToWatch(index) {
  const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];
  const movie = toWatchMovies.splice(index, 1)[0];

  localStorage.setItem("toWatchMovies", JSON.stringify(toWatchMovies));

  alert(`"${movie.title}" kustutati vaatamise plaanist.`);
  window.location.reload(); // Värskenda lehte, et muudatused kajastuksid
}
