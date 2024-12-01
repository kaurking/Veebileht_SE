// This code was written with ChatGPT tools

// ENTER vajutades ei refreshi page
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Form submitted, but no page refresh!");
});

// localStorage salvestab nime ja profiilipildi
// Load data from LocalStorage on page load
window.onload = function () {
    const savedUsername = localStorage.getItem("username");
    const savedProfilePicture = localStorage.getItem("profilePicture");

    // Restore the username
    if (savedUsername) {
        document.getElementById("username").value = savedUsername;
    }

    // Restore the profile picture
    if (savedProfilePicture) {
        const preview = document.getElementById("preview");
        preview.src = savedProfilePicture;
        preview.style.display = "block";
    }
};

// Save data to LocalStorage
document.getElementById("save-button").addEventListener("click", () => {
    const username = document.getElementById("username").value;

    // Save username to LocalStorage
    if (username) {
        localStorage.setItem("username", username);
    }

    // Save profile picture to LocalStorage as Base64
    const fileInput = document.getElementById("profile-picture");
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Optional: Check file size limit (e.g., 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            alert("Pilt on liiga suur! Maksimaalne failisuurus on 2MB.");
            return;
        }

        // Convert image to Base64
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Image = e.target.result;
            localStorage.setItem("profilePicture", base64Image);

            // Update the preview
            const preview = document.getElementById("preview");
            preview.src = base64Image;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

    // Show a success message
    document.getElementById("message").innerText = "Andmed salvestatud!";
});