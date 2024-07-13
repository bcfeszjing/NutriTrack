document.addEventListener('DOMContentLoaded', (event) => {
    // Set the current date in the date input
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    displayFoodList();
});

function displayFoodList() {
    const selectedDate = document.getElementById('date').value;
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    categories.forEach(category => {
        const categoryContainer = document.getElementById(category).querySelector('.food-items');
        categoryContainer.innerHTML = '';

        const foods = savedFoods.filter(food => food.date === selectedDate && food.category === category);

        foods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.innerHTML = `
                <span>${food.foodName}</span>
                <span onclick="viewFoodDetails('${food.foodName}', '${selectedDate}', '${category}')">...</span>
            `;
            categoryContainer.appendChild(foodItem);
        });
    });
}

function viewFoodDetails(foodName, date, category) {
    const queryString = `foodName=${encodeURIComponent(foodName)}&date=${encodeURIComponent(date)}&category=${encodeURIComponent(category)}`;
    window.location.href = `foodDetails.html?${queryString}`;
}
