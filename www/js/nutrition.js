document.addEventListener('DOMContentLoaded', (event) => {
    // Set the current date in the date input
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    displayNutritionDetails();
});

function displayNutritionDetails() {
    const selectedDate = document.getElementById('date').value;

    fetch(`/NutriTrack/www/php/getUserFoodEntries.php?date=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(savedFoods => {
            console.log('Saved foods from database:', savedFoods); // Debugging log

            const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

            categories.forEach(category => {
                const categoryContainer = document.getElementById(category).querySelector('.food-items');
                const totalKcalSpan = document.getElementById(`${category}-kcal`);
                categoryContainer.innerHTML = '';

                let totalKcal = 0;

                const foods = savedFoods.filter(food => food.category === category);
                console.log(`Foods for ${category} on ${selectedDate}:`, foods); // Debugging log

                foods.forEach(food => {
                    totalKcal += parseFloat(food.calories);

                    const foodItem = document.createElement('div');
                    foodItem.className = 'food-item';
                    foodItem.innerHTML = `
                        <span>${food.food_name} - ${food.calories} kcal</span>
                        <img src="img/three-horizontal-dots-icon.png" alt="details" class="view-details" onclick="viewFoodDetails('${food.food_name}', '${selectedDate}', '${category}')">
                    `;
                    categoryContainer.appendChild(foodItem);
                });

                totalKcalSpan.innerText = totalKcal.toFixed(2);
            });
        })
        .catch(error => console.error('Fetch Error:', error));
}

function goToAddFoodDetails(category) {
    const selectedDate = document.getElementById('date').value;
    const queryString = `date=${encodeURIComponent(selectedDate)}&category=${encodeURIComponent(category)}`;
    window.location.href = `addFoodDetails.html?${queryString}`;
}

function viewFoodDetails(foodName, date, category) {
    const queryString = `foodName=${encodeURIComponent(foodName)}&date=${encodeURIComponent(date)}&category=${encodeURIComponent(category)}`;
    window.location.href = `foodDetails.html?${queryString}`;
}
