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
  main.innerHTML = '';

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview} = movie
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <button class="nupp_postril">+</button>
    <div class="dropdown hidden">
      <button class="dropdown-item" onclick="markAsWatched('${title}')">Vaadatud</button>
      <button class="dropdown-item" onclick="markAsToWatch('${title}')">Vaatamiseks</button>
    </div>
    <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>`
    main.appendChild(movieEl);
  })
  setupDropdowns(); // Seome dropdowni sündmused pärast elementide loomist
}
function setupDropdowns() {
  document.querySelectorAll(".nupp_postril").forEach(button => {
    const dropdown = button.nextElementSibling;

    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Takistab sündmuse levikut

      // Sulge kõik teised dropdownid
      document.querySelectorAll(".dropdown").forEach(otherDropdown => {
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
    document.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.classList.add("hidden");
    });
  });
}
function markAsWatched(title) {
  alert(`"${title}" märgiti vaadatuks!`);
}

function markAsToWatch(title) {
  alert(`"${title}" lisati vaatamise plaani!`);
}

function getColor(vote) {
  if(vote >= 8){
    return "green"
  }else if (vote >= 5){
    return "orange"
  }else{
    return "red"
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if(searchTerm) {
    getMovies(searchURL +'&query='+searchTerm)
  }else{
    getMovies(API_URL);
  }
});