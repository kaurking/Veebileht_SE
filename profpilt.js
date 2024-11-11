// This code was written by ChatGPT
// Get the file input and preview image elements
const fileInput = document.getElementById('profile-picture');
const previewImage = document.getElementById('preview');

// Add an event listener to handle the file input change event
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImage.src = e.target.result; // Set the image source to the file data
            previewImage.style.display = 'block'; // Show the preview image
        };
        
        reader.readAsDataURL(file); // Convert the file to a data URL
    }
});