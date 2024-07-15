document.addEventListener('DOMContentLoaded', () => {
    displayTodayMeals();
    calculateTodayCalories();
    fetchUsername();
});

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayTodayMeals() {
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const today = getCurrentDate();

    const todayMeals = savedFoods.filter(food => food.date === today);

    const mealList = document.getElementById('meals-list');
    mealList.innerHTML = ''; // Clear existing content

    todayMeals.forEach(meal => {
        const li = document.createElement('li');
        li.innerText = `${meal.foodName} (${meal.servingSize}g) - ${meal.nutrition.calories} calories`;
        mealList.appendChild(li);
    });
}

function calculateTodayCalories() {
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const today = getCurrentDate();

    const todayMeals = savedFoods.filter(food => food.date === today);

    let totalCalories = 0;
    todayMeals.forEach(meal => {
        totalCalories += parseFloat(meal.nutrition.calories);
    });

    document.getElementById('calories-intake').innerText = `${totalCalories.toFixed(1)} kcal`;
}

function fetchUsername() {
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
                document.getElementById('header-greeting').innerText = `Welcome, ${data.username}`;
            }
        })
        .catch(error => console.error('Fetch Error:', error));
}
