// See kood on kirjutatud ChatGPT tööriistadega


// ENTER vajutades ei refreshi page
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Form submitted, but no page refresh!");
});
//----------------------------------------------------------------------------
// Profiili nime ja pildi salveastamine kasutaades LocalStorage: 

// localStorage salvestab nime ja profiilipildi
// Laeb lehe laadimisel LocalStorage'ist data
document.addEventListener("DOMContentLoaded", function () {
    const savedUsername = localStorage.getItem("username");
    const savedProfilePicture = localStorage.getItem("profilePicture");

    // Taastab kasutajanime
    if (savedUsername) {
        document.getElementById("username").value = savedUsername;
    }

    // Taastab profiilipildi
    if (savedProfilePicture) {
        const preview = document.getElementById("preview");
        preview.src = savedProfilePicture;
        preview.style.display = "block";
    }

    // Salvestab andmed LocalStorage
    document.getElementById("save-button").addEventListener("click", () => {
        const username = document.getElementById("username").value;

        // Salvestab kasutajanime LocalStorage
        if (username) {
            localStorage.setItem("username", username);
        }

        // Salvestab profiilipildi LocalStorage Base64-na
        const fileInput = document.getElementById("profile-picture");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Faili suuruse limiit (2MB --> saab muuta)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                alert("Pilt on liiga suur! Maksimaalne failisuurus on 2MB.");
                return;
         }

            // Muudab pildi Base64-ks
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Image = e.target.result;
                localStorage.setItem("profilePicture", base64Image);

                // Uuendab vaadet
                const preview = document.getElementById("preview");
                preview.src = base64Image;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }

        // Kõik timm message
        document.getElementById("message").innerText = "Andmed salvestatud!";
    });
});