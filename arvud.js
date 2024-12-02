// See kood on kirjutatud ChatGPT tööriistadega
// vaadatud_plaanis olevad muutujad salvestatakse LocalStorageisse ja siin need laetakse profiili alla.
// Lehe laadimisel laeb sisestuste arvud
document.addEventListener("DOMContentLoaded", function () {
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
    const toWatchMovies = JSON.parse(localStorage.getItem("toWatchMovies")) || [];

    // uuendab lehel neid arve
    document.getElementById("watched-count").innerText = `Vaadatud: ${watchedMovies.length}.`;
    document.getElementById("to-watch-count").innerText = `Plaanis: ${toWatchMovies.length}.`;
});
