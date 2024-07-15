document.addEventListener('DOMContentLoaded', (event) => {
    // Set the current date in the date input
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    displayNutritionDetails();
});

function displayNutritionDetails() {
    const selectedDate = document.getElementById('date').value;
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    categories.forEach(category => {
        const categoryContainer = document.getElementById(category).querySelector('.food-items');
        const totalKcalSpan = document.getElementById(`${category}-kcal`);
        categoryContainer.innerHTML = '';

        let totalKcal = 0;

        const foods = savedFoods.filter(food => food.date === selectedDate && food.category === category);

        foods.forEach(food => {
            totalKcal += parseFloat(food.nutrition.calories);

            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.innerHTML = `
                <span>${food.foodName}</span>
                <span onclick="viewFoodDetails('${food.foodName}', '${selectedDate}', '${category}')">...</span>
            `;
            categoryContainer.appendChild(foodItem);
        });

        totalKcalSpan.innerText = totalKcal.toFixed(2);
    });
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
