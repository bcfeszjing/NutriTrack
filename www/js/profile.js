//profile.js
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

                // Load weight, height, gender, birth date, and age from database
                document.getElementById('weight').innerText = data.weight !== null ? data.weight : 'Enter Weight';
                document.getElementById('height').innerText = data.height !== null ? data.height : 'Enter Height';
                document.getElementById('gender').innerText = data.gender !== null ? data.gender : 'Select Gender';
                document.getElementById('birth-date').innerText = data.birth_date !== null ? data.birth_date : 'Select Birth Date';
                document.getElementById('age').innerText = data.age !== null ? data.age : 'Enter Age';
                if (data.profile_picture) {
                    document.getElementById('profile-pic').src = `data:image/jpeg;base64,${data.profile_picture}`;
                } else {
                    document.getElementById('profile-pic').src = 'img/5951752.png'; // Default profile picture
                }
            }
        })
        .catch(error => console.error('Fetch Error:', error));
});

function chooseProfilePicture() {
    // Show options to either pick from media or open camera
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

function removePhoto() {
    document.getElementById('profile-pic').src = 'img/5951752.png';
    saveUserData('profile_picture', null);
    closeModal();
}

function updateProfilePic(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;

            // Save profile picture to the database
            saveUserData('profile_picture', e.target.result.split(',')[1]);
        }
        reader.readAsDataURL(event.target.files[0]);
        closeModal();
    }
}

function editField(field) {
    if (field === 'password') {
        document.getElementById('password-modal').style.display = 'block';
        const passwordInput = document.getElementById('password-input');
        passwordInput.type = 'password';
        passwordInput.value = '*'.repeat(document.getElementById('password').dataset.password.length); // Set password field with asterisks
    } else if (field === 'gender') {
        document.getElementById('gender-modal').style.display = 'block';
    } else if (field === 'birth-date') {
        document.getElementById('birth-date-modal').style.display = 'block';
    } else {
        const currentValue = document.getElementById(field).innerText;
        const newValue = prompt(`Edit ${field}`, currentValue);
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

function closeGenderModal() {
    document.getElementById('gender-modal').style.display = 'none';
}

function closeBirthDateModal() {
    document.getElementById('birth-date-modal').style.display = 'none';
}

function saveGender() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    document.getElementById('gender').innerText = gender;
    saveUserData('gender', gender);
    closeGenderModal();
}

function saveBirthDate() {
    const birthDate = document.getElementById('birth-date-input').value;
    if (birthDate) {
        document.getElementById('birth-date').innerText = birthDate;
        const age = calculateAge(birthDate);
        document.getElementById('age').innerText = age;
        saveUserData('birth_date', birthDate);
        saveUserData('age', age);
    } else {
        alert('Please enter a valid birth date.');
    }
    closeBirthDateModal();
}

function calculateAge(birthDate) {
    if (!birthDate) return '';
    const birthDateObj = new Date(birthDate);
    const ageDifMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
