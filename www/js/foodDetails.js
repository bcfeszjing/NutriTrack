document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const foodName = params.get('foodName');
    const date = params.get('date');
    const category = params.get('category');

    fetchFoodDetails(foodName, date, category);
});

function fetchFoodDetails(foodName, date, category) {
    const userId = sessionStorage.getItem('userId'); // Assuming user ID is stored in sessionStorage

    fetch(`/NutriTrack/www/php/getFoodDetails.php?user_id=${userId}&food_name=${foodName}&date=${date}&category=${category}`)
        .then(response => response.json())
        .then(foodDetails => {
            if (foodDetails) {
                populateForm(foodDetails);
            } else {
                console.error('Food details not found');
            }
        })
        .catch(error => console.error('Error fetching food details:', error));
}

function populateForm(foodDetails) {
    document.getElementById('foodName').value = foodDetails.food_name;
    document.getElementById('servingSize').value = parseInt(foodDetails.serving_size);
    document.getElementById('calories').value = parseFloat(foodDetails.calories).toFixed(2);
    document.getElementById('protein').value = parseFloat(foodDetails.protein).toFixed(2);
    document.getElementById('fat').value = parseFloat(foodDetails.fat).toFixed(2);
    document.getElementById('fiber').value = parseFloat(foodDetails.fiber).toFixed(2);
    document.getElementById('sugar').value = parseFloat(foodDetails.sugar).toFixed(2);
    document.getElementById('carbs').value = parseFloat(foodDetails.carbs).toFixed(2);
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

    fetch('/NutriTrack/www/php/updateFoodDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFoodDetails),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Food details updated successfully!');
            window.location.href = 'nutrition.html';
        } else {
            console.error('Failed to update food details:', data.error);
            alert('Failed to update food details.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating food details.');
    });
}

function deleteFood() {
    const foodName = document.getElementById('foodName').value;
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    const category = params.get('category');

    const foodDetails = {
        food_name: foodName,
        date,
        category
    };

    fetch('/NutriTrack/www/php/deleteFoodDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodDetails),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Food deleted successfully!');
            window.location.href = 'nutrition.html'; // Navigate back to nutrition.html
        } else {
            console.error('Error deleting food:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

