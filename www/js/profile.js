document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('email') || '';
    const weight = localStorage.getItem('weight') || '';
    const height = localStorage.getItem('height') || '';
    const password = localStorage.getItem('password') || '';

    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;
    document.getElementById('weight').innerText = weight;
    document.getElementById('height').innerText = height;
    document.getElementById('password').innerText = '*'.repeat(password.length);
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
    let newValue = '';

    if (field === 'password') {
        document.getElementById('password-modal').style.display = 'block';
        document.getElementById('new-password').value = '';
    } else if (field === 'email') {
        newValue = prompt(`Edit ${field}`, currentValue);
        if (newValue && validateEmail(newValue)) {
            localStorage.setItem(field, newValue);
            document.getElementById(field).innerText = newValue;
        } else {
            alert('Please enter a valid email address.');
        }
    } else if (field === 'weight' || field === 'height') {
        newValue = prompt(`Edit ${field}`, currentValue);
        if (newValue && /^\d{1,3}$/.test(newValue)) {
            localStorage.setItem(field, newValue);
            document.getElementById(field).innerText = newValue;
        } else {
            alert('Please enter a valid number with up to 3 digits.');
        }
    } else {
        newValue = prompt(`Edit ${field}`, currentValue);
        if (newValue) {
            localStorage.setItem(field, newValue);
            document.getElementById(field).innerText = newValue;
        }
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('new-password');
    const toggleButton = document.getElementById('toggle-password-visibility');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

function savePassword() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword) {
        localStorage.setItem('password', newPassword);
        document.getElementById('password').innerText = '*'.repeat(newPassword.length);
        closePasswordModal();
    } else {
        alert('Please enter a new password.');
    }
}

function closePasswordModal() {
    document.getElementById('password-modal').style.display = 'none';
}

function logout() {
    localStorage.clear();
    location.href = 'index.html';
}
