function goBack() {
    window.history.back();
}

function calculateMyRDI() {
    // Load weight, height, gender, and age from localStorage
    let weight = parseFloat(localStorage.getItem('weight'));
    let height = parseFloat(localStorage.getItem('height'));
    let gender = localStorage.getItem('gender');
    let age = parseInt(localStorage.getItem('age'));

    // Display loaded values in the UI
    document.getElementById('weightDisplay').innerText = weight || 'Enter Weight';
    document.getElementById('heightDisplay').innerText = height || 'Enter Height';
    document.getElementById('genderDisplay').innerText = gender || 'Select Gender';
    document.getElementById('ageDisplay').innerText = age || 'Enter Age';

    // Hide goalSection and show rdiSection
    document.getElementById('goalSection').classList.add('hidden');
    document.getElementById('rdiSection').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden'); 
}

function calculateRDI() {
    // Load weight, height, gender, and age from localStorage
    let weight = parseFloat(localStorage.getItem('weight'));
    let height = parseFloat(localStorage.getItem('height'));
    let gender = localStorage.getItem('gender');
    let age = parseInt(localStorage.getItem('age'));

    // Display loaded values in the UI
    document.getElementById('weightDisplay').innerText = weight;
    document.getElementById('heightDisplay').innerText = height;
    document.getElementById('genderDisplay').innerText = gender;
    document.getElementById('ageDisplay').innerText = age;

    // Calculate BMR based on gender
    let bmr;
    if (gender.toLowerCase() === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender.toLowerCase() === 'female') {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    } else {
        alert('Invalid gender specified.');
        return;
    }

    // Get selected diet goal and corresponding activity factor
    let dietGoal = document.getElementById('dietGoal').value;
    let activityFactor;

    switch (dietGoal) {
        case 'maintain':
            activityFactor = 1.2; // Standard maintenance
            break;
        case 'slow_gain':
            activityFactor = 1.3; // Small calorie surplus for slow gain
            break;
        case 'gain':
            activityFactor = 1.5; // Larger calorie surplus for gain
            break;
        case 'slow_loss':
            activityFactor = 1.1; // Small calorie deficit for slow loss
            break;
        case 'loss':
            activityFactor = 0.9; // Larger calorie deficit for loss
            break;
        default:
            activityFactor = 1.2; // Default to maintenance if no goal is specified
            break;
    }

    // Calculate RDI
    let rdi = Math.round(bmr * activityFactor);

    // Save RDI to localStorage
    localStorage.setItem('rdi', rdi);

    // Display the calculated RDI in the result section
    let rdiResultElement = document.getElementById('rdiResult');
    rdiResultElement.innerHTML = `Your Recommended Daily Intake (RDI) is: <span id="rdiValue">${rdi}</span> kcal`;

    // Toggle visibility of sections
    document.getElementById('goalSection').classList.add('hidden');
    document.getElementById('rdiSection').classList.add('hidden');
    document.getElementById('resultSection').classList.remove('hidden');
}

function saveResult() {
    // Redirect to report.html after calculation
    window.location.href = 'report.html';
}

function recalculate() {
    // Clear inputs and show the calculate RDI section
    document.getElementById('rdiSection').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
}

function editInfo(field) {
    let currentValue = localStorage.getItem(field) || '';
    let newValue = prompt(`Enter new ${field}:`, currentValue);

    if (newValue !== null && newValue !== '') {
        localStorage.setItem(field, newValue);
        document.getElementById(`${field}Display`).innerText = newValue;
    }
}
