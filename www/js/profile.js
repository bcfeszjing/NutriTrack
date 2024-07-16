document.addEventListener('DOMContentLoaded', () => {
    fetch('/NutriTrack/www/php/getUserData.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                document.getElementById('username').innerText = data.username;
                document.getElementById('email').innerText = data.email;
                document.getElementById('password').innerText = '*'.repeat(data.passwordLength);
                document.getElementById('password').dataset.password = data.originalPassword; // Store actual password in data attribute
                document.getElementById('password-input').dataset.password = data.originalPassword; // Store actual password in data attribute for modal
                
                // Load weight and height from localStorage
                document.getElementById('weight').innerText = localStorage.getItem('weight') || 'Enter weight';
                document.getElementById('height').innerText = localStorage.getItem('height') || 'Enter height';
            }
        })
        .catch(error => console.error('Fetch Error:', error));
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
    const currentValue = document.getElementById(field).innerText;
    let newValue = '';

    if (field === 'password') {
        document.getElementById('password-modal').style.display = 'block';
        const passwordInput = document.getElementById('password-input');
        passwordInput.type = 'password';
        passwordInput.value = '*'.repeat(document.getElementById('password').dataset.password.length); // Set password field with asterisks
    } else {
        newValue = prompt(`Edit ${field}`, currentValue);
        if (newValue) {
            if (field === 'email' && !validateEmail(newValue)) {
                alert('Please enter a valid email address.');
                return;
            }
            if ((field === 'weight' || field === 'height') && !/^\d{1,3}$/.test(newValue)) {
                alert('Please enter a valid number with up to 3 digits.');
                return;
            }
            document.getElementById(field).innerText = newValue;
            localStorage.setItem(field, newValue); // Save weight and height to localStorage
            saveUserData(field, newValue);
        }
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password-input');
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    passwordInput.value = isPasswordVisible ? '*'.repeat(passwordInput.dataset.password.length) : passwordInput.dataset.password;
}

function savePassword() {
    const newPassword = document.getElementById('password-input').value;
    if (newPassword) {
        saveUserData('password', newPassword, true);
    } else {
        alert('Please enter a new password.');
    }
}

function closePasswordModal() {
    document.getElementById('password-modal').style.display = 'none';
}

function saveUserData(field, value, isPassword = false) {
    const data = { field: field, value: value };

    fetch('/NutriTrack/www/php/updateUserData.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            console.log('User data updated successfully');
            if (isPassword) {
                document.getElementById('password').innerText = '*'.repeat(value.length);
                document.getElementById('password').dataset.password = value;
                document.getElementById('password-input').dataset.password = value;
                closePasswordModal();
            } else {
                // Save weight and height to localStorage
                if (field === 'weight' || field === 'height') {
                    localStorage.setItem(field, value);
                }
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout() {
    fetch('/NutriTrack/www/php/logout.php')
        .then(() => {
            location.href = 'index.html';
        })
        .catch(error => console.error('Error:', error));
}
