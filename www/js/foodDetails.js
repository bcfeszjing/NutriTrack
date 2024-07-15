document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch and display food details based on query parameters
    const params = new URLSearchParams(window.location.search);
    const foodName = params.get('foodName');
    const date = params.get('date');
    const category = params.get('category');

    const foodDetails = fetchFoodDetails(foodName, date, category);
    if (foodDetails) {
        populateForm(foodDetails); // Populate form with fetched food details
    } else {
        console.error('Food details not found');
    }
});

function fetchFoodDetails(foodName, date, category) {
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const foundFood = savedFoods.find(food => food.foodName === foodName && food.date === date && food.category === category);
    return foundFood;
}

function populateForm(foodDetails) {
    // Populate form fields with fetched food details
    document.getElementById('foodName').value = foodDetails.foodName;
    document.getElementById('servingSize').value = parseFloat(foodDetails.servingSize).toFixed(3); // Ensure it's parsed as a float
    document.getElementById('calories').value = parseFloat(foodDetails.nutrition.calories).toFixed(1);
    document.getElementById('protein').value = parseFloat(foodDetails.nutrition.protein).toFixed(1);
    document.getElementById('fat').value = parseFloat(foodDetails.nutrition.fat).toFixed(1);
    document.getElementById('fiber').value = parseFloat(foodDetails.nutrition.fiber).toFixed(1);
    document.getElementById('sugar').value = parseFloat(foodDetails.nutrition.sugar).toFixed(1);
    document.getElementById('carbs').value = parseFloat(foodDetails.nutrition.carbs).toFixed(1);
}

function saveEditedFood() {
    // Gather edited food details from form fields
    const foodName = document.getElementById('foodName').value;
    const servingSize = parseFloat(document.getElementById('servingSize').value).toFixed(3); // Ensure it's parsed as a float
    const calories = parseFloat(document.getElementById('calories').value).toFixed(1);
    const protein = parseFloat(document.getElementById('protein').value).toFixed(1);
    const fat = parseFloat(document.getElementById('fat').value).toFixed(1);
    const fiber = parseFloat(document.getElementById('fiber').value).toFixed(1);
    const sugar = parseFloat(document.getElementById('sugar').value).toFixed(1);
    const carbs = parseFloat(document.getElementById('carbs').value).toFixed(1);

    const updatedFoodDetails = {
        foodName,
        servingSize,
        nutrition: {
            calories,
            protein,
            fat,
            fiber,
            sugar,
            carbs
        }
    };

    // Update food details in localStorage
    updateFoodDetails(updatedFoodDetails);

    alert('Food details updated successfully!');
    // Optionally navigate back to nutrition.html or any other page after saving
}

function updateFoodDetails(updatedFoodDetails) {
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const index = savedFoods.findIndex(food => food.foodName === updatedFoodDetails.foodName);
    if (index !== -1) {
        savedFoods[index] = updatedFoodDetails;
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
    } else {
        console.error('Food details not found for update');
    }
}

function deleteFood() {
    const foodName = document.getElementById('foodName').value;
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const filteredFoods = savedFoods.filter(food => food.foodName !== foodName);
    
    localStorage.setItem('savedFoods', JSON.stringify(filteredFoods));
    
    alert('Food deleted successfully!');
    // Optionally navigate back to nutrition.html or any other page after deleting
}
