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
                document.getElementById('weightDisplay').innerText = data.weight !== null ? data.weight : 'Enter Weight';
                document.getElementById('heightDisplay').innerText = data.height !== null ? data.height : 'Enter Height';
                document.getElementById('genderDisplay').innerText = data.gender !== null ? data.gender : 'Select Gender';
                document.getElementById('ageDisplay').innerText = data.age !== null ? data.age : 'Enter Age';
            }
        })
        .catch(error => console.error('Fetch Error:', error));
});

function goBack() {
    window.history.back();
}

function calculateMyRDI() {
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
                document.getElementById('weightDisplay').innerText = data.weight !== null ? data.weight : 'Enter Weight';
                document.getElementById('heightDisplay').innerText = data.height !== null ? data.height : 'Enter Height';
                document.getElementById('genderDisplay').innerText = data.gender !== null ? data.gender : 'Select Gender';
                document.getElementById('ageDisplay').innerText = data.age !== null ? data.age : 'Enter Age';

                document.getElementById('goalSection').classList.add('hidden');
                document.getElementById('rdiSection').classList.remove('hidden');
                document.getElementById('resultSection').classList.add('hidden');
            }
        })
        .catch(error => console.error('Fetch Error:', error));
}

function calculateRDI() {
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
                let weight = parseFloat(data.weight);
                let height = parseFloat(data.height);
                let gender = data.gender;
                let age = parseInt(data.age);

                document.getElementById('weightDisplay').innerText = weight;
                document.getElementById('heightDisplay').innerText = height;
                document.getElementById('genderDisplay').innerText = gender;
                document.getElementById('ageDisplay').innerText = age;

                let bmr;
                if (gender.toLowerCase() === 'male') {
                    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
                } else if (gender.toLowerCase() === 'female') {
                    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
                } else {
                    alert('Invalid gender specified.');
                    return;
                }

                let dietGoal = document.getElementById('dietGoal').value;
                let activityFactor;

                switch (dietGoal) {
                    case 'maintain':
                        activityFactor = 1.2;
                        break;
                    case 'slow_gain':
                        activityFactor = 1.3;
                        break;
                    case 'gain':
                        activityFactor = 1.5;
                        break;
                    case 'slow_loss':
                        activityFactor = 1.1;
                        break;
                    case 'loss':
                        activityFactor = 0.9;
                        break;
                    default:
                        activityFactor = 1.2;
                        break;
                }

                let rdi = Math.round(bmr * activityFactor);

                let rdiResultElement = document.getElementById('rdiResult');
                rdiResultElement.innerHTML = `Your Recommended Daily Intake (RDI) is: <span id="rdiValue">${rdi}</span> kcal`;

                document.getElementById('goalSection').classList.add('hidden');
                document.getElementById('rdiSection').classList.add('hidden');
                document.getElementById('resultSection').classList.remove('hidden');

                updateRDI(rdi);
            }
        })
        .catch(error => console.error('Fetch Error:', error));
}

function saveResult() {
    const rdiValue = document.getElementById('rdiValue').innerText;

    updateRDI(rdiValue)
        .then(() => {
            window.location.href = 'report.html';
        })
        .catch(error => console.error('Error saving RDI:', error));
}

function recalculate() {
    document.getElementById('rdiSection').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
}

function updateRDI(rdiValue) {
    return fetch('/NutriTrack/www/php/updateRDI.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rdi: rdiValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('RDI updated successfully');
        } else {
            console.error('Failed to update RDI:', data.message);
        }
    })
    .catch(error => console.error('Error updating RDI:', error));
}
