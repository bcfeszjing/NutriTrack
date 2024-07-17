// JavaScript for goal.html

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
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Get selected diet goal and corresponding activity factor
    let dietGoal = document.getElementById('dietGoal').value;
    let activityFactor;

    switch (dietGoal) {
        case 'maintain':
            activityFactor = 1.2; // Sedentary
            break;
        case 'slow_gain':
            activityFactor = 1.375; // Lightly active
            break;
        case 'gain':
            activityFactor = 1.55; // Moderately active
            break;
        case 'slow_loss':
            activityFactor = 1.725; // Very active
            break;
        case 'loss':
            activityFactor = 1.9; // Extra active
            break;
        default:
            activityFactor = 1.2; // Default to Sedentary if no valid option is selected
            break;
    }

    // Calculate RDI
    let rdi = Math.round(bmr * activityFactor);

    // Display the calculated RDI in the result section
    let rdiResultElement = document.getElementById('rdiResult');
    rdiResultElement.innerHTML = `Your Recommended Daily Intake (RDI) is: <span id="rdiValue">${rdi}</span> kcal`;
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
