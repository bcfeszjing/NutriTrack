document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const foodName = params.get('foodName');
    const date = params.get('date');
    const category = params.get('category');

    const foodDetails = fetchFoodDetails(foodName, date, category);
    if (foodDetails) {
        populateForm(foodDetails);
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
    document.getElementById('foodName').value = foodDetails.foodName;
    document.getElementById('servingSize').value = parseInt(foodDetails.servingSize);
    document.getElementById('calories').value = parseFloat(foodDetails.nutrition.calories).toFixed(2);
    document.getElementById('protein').value = parseFloat(foodDetails.nutrition.protein).toFixed(2);
    document.getElementById('fat').value = parseFloat(foodDetails.nutrition.fat).toFixed(2);
    document.getElementById('fiber').value = parseFloat(foodDetails.nutrition.fiber).toFixed(2);
    document.getElementById('sugar').value = parseFloat(foodDetails.nutrition.sugar).toFixed(2);
    document.getElementById('carbs').value = parseFloat(foodDetails.nutrition.carbs).toFixed(2);
}

async function fetchFoodDetailsFromAPI() {
    const foodName = document.getElementById('foodName').value;
    const servingSize = parseInt(document.getElementById('servingSize').value);
    const query = `${servingSize}g ${foodName}`;
    const apiKey = 'C88S0O73Y7LOimgVjnnAiA==BddFHkUwNFO1u7hd';
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${query}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            displayFoodDetails(data.items[0]);
        } else {
            console.error('No food details found');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayFoodDetails(foodDetails) {
    document.getElementById('foodName').value = foodDetails.name;
    document.getElementById('calories').value = parseFloat(foodDetails.calories).toFixed(2);
    document.getElementById('protein').value = parseFloat(foodDetails.protein_g).toFixed(2);
    document.getElementById('fat').value = parseFloat(foodDetails.fat_total_g).toFixed(2);
    document.getElementById('fiber').value = parseFloat(foodDetails.fiber_g).toFixed(2);
    document.getElementById('sugar').value = parseFloat(foodDetails.sugar_g).toFixed(2);
    document.getElementById('carbs').value = parseFloat(foodDetails.carbohydrates_total_g).toFixed(2);
}

function saveEditedFood() {
    const foodName = document.getElementById('foodName').value;
    const servingSize = parseInt(document.getElementById('servingSize').value);
    const calories = parseFloat(document.getElementById('calories').value).toFixed(2);
    const protein = parseFloat(document.getElementById('protein').value).toFixed(2);
    const fat = parseFloat(document.getElementById('fat').value).toFixed(2);
    const fiber = parseFloat(document.getElementById('fiber').value).toFixed(2);
    const sugar = parseFloat(document.getElementById('sugar').value).toFixed(2);
    const carbs = parseFloat(document.getElementById('carbs').value).toFixed(2);

    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    const category = params.get('category');

    const updatedFoodDetails = {
        foodName,
        date,
        category,
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

    updateFoodDetails(updatedFoodDetails);
    alert('Food details updated successfully!');
    window.location.href = 'nutrition.html'; // Navigate back to nutrition.html
}

function updateFoodDetails(updatedFoodDetails) {
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const index = savedFoods.findIndex(food => food.foodName === updatedFoodDetails.foodName && food.date === updatedFoodDetails.date && food.category === updatedFoodDetails.category);
    if (index !== -1) {
        savedFoods[index] = updatedFoodDetails;
        localStorage.setItem('savedFoods', JSON.stringify(savedFoods));
    } else {
        console.error('Food details not found for update');
    }
}

function deleteFood() {
    const foodName = document.getElementById('foodName').value;
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    const category = params.get('category');
    
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    const filteredFoods = savedFoods.filter(food => !(food.foodName === foodName && food.date === date && food.category === category));
    
    localStorage.setItem('savedFoods', JSON.stringify(filteredFoods));
    
    alert('Food deleted successfully!');
    window.location.href = 'nutrition.html'; // Navigate back to nutrition.html
}
