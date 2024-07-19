document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
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
    console.log('displayTodayMeals function called');
    fetch('/NutriTrack/www/php/getTodayMeals.php')
        .then(response => {
            console.log('getTodayMeals.php response:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(savedFoods => {
            console.log('Saved foods from database:', savedFoods);
            const mealList = document.getElementById('meals-list');
            mealList.innerHTML = ''; // Clear existing content

            if (savedFoods.length === 0) {
                mealList.innerHTML = '<li>No meals for today</li>';
            } else {
                savedFoods.forEach(meal => {
                    const li = document.createElement('li');
                    li.innerText = `${meal.food_name} (${meal.serving_size}g) - ${meal.calories} calories`;
                    mealList.appendChild(li);
                    console.log('Appending meal to list:', li.innerText); // Add this line
                });
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function calculateTodayCalories() {
    console.log('calculateTodayCalories function called');
    fetch('/NutriTrack/www/php/getTodayMeals.php')
        .then(response => {
            console.log('getTodayMeals.php response:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(savedFoods => {
            console.log('Saved foods from database:', savedFoods);
            let totalCalories = 0;

            savedFoods.forEach(meal => {
                totalCalories += parseFloat(meal.calories);
                console.log('Adding calories:', meal.calories); // Add this line
            });

            const caloriesIntakeElement = document.getElementById('calories-intake');
            caloriesIntakeElement.innerText = `${totalCalories.toFixed(1)} kcal`;
            console.log('Total calories intake updated:', caloriesIntakeElement.innerText); // Add this line
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function fetchUsername() {
    console.log('fetchUsername function called');
    fetch('/NutriTrack/www/php/getUserData.php')
        .then(response => {
            console.log('getUserData.php response:', response);
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
                console.log('Username fetched and updated:', data.username); // Add this line
            }
        })
        .catch(error => console.error('Fetch Error:', error));
}
