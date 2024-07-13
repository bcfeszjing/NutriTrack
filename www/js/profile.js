document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Default Username';
    const email = localStorage.getItem('email') || 'user@example.com';
    const weight = localStorage.getItem('weight') || '70';
    const height = localStorage.getItem('height') || '170';

    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;
    document.getElementById('weight').innerText = weight;
    document.getElementById('height').innerText = height;
});

function chooseProfilePicture() {
    document.getElementById('profile-pic-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('profile-pic-modal').style.display = 'none';
}

function openMediaPicker() {
    document.getElementById('file-input').click();
}

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // Handle the camera stream
            document.getElementById('file-input').click();
        })
        .catch(err => {
            alert('Camera permission is required.');
        });
}

function updateProfilePic(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        closeModal();
    }
}

function editField(field) {
    const currentValue = localStorage.getItem(field) || '';
    const newValue = prompt(`Edit ${field}`, currentValue);
    if (newValue) {
        localStorage.setItem(field, newValue);
        document.getElementById(field).innerText = newValue;
    }
}