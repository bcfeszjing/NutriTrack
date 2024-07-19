document.addEventListener('DOMContentLoaded', (event) => {
    // Set the category and date from query parameters
    const params = new URLSearchParams(window.location.search);
    let category = params.get('category');
    const date = params.get('date');

    if (category) {
        // Capitalize the first letter of the category
        category = category.charAt(0).toUpperCase() + category.slice(1);
        document.getElementById('category').value = category;
    }

    if (date) {
        document.getElementById('date').value = date;
    }
});

async function fetchFoodDetails() {
    const foodName = document.getElementById('foodName').value;
    const servingSize = parseInt(document.getElementById('servingSize').value); // Parse to integer to remove decimals
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
        displayFoodDetails(data.items[0]);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayFoodDetails(foodDetails) {
    // Capitalize the first letter of the food name
    const capitalizedFoodName = foodDetails.name.charAt(0).toUpperCase() + foodDetails.name.slice(1);

    document.getElementById('detail_foodName').innerText = capitalizedFoodName;
    document.getElementById('calories').innerText = foodDetails.calories;
    document.getElementById('protein_g').innerText = foodDetails.protein_g;
    document.getElementById('fat_total_g').innerText = foodDetails.fat_total_g;
    document.getElementById('fiber_g').innerText = foodDetails.fiber_g;
    document.getElementById('sugar_g').innerText = foodDetails.sugar_g;
    document.getElementById('carbohydrates_total_g').innerText = foodDetails.carbohydrates_total_g;
}

function saveFoodDetails() {
    const userId = sessionStorage.getItem('userId'); // Assuming user ID is stored in sessionStorage
    const category = document.getElementById('category').value.toLowerCase();
    const date = document.getElementById('date').value;
    const foodName = document.getElementById('foodName').value;
    const servingSize = parseInt(document.getElementById('servingSize').value); // Parse to integer to remove decimals
    const calories = document.getElementById('calories').innerText;
    const protein = document.getElementById('protein_g').innerText;
    const fat = document.getElementById('fat_total_g').innerText;
    const fiber = document.getElementById('fiber_g').innerText;
    const sugar = document.getElementById('sugar_g').innerText;
    const carbs = document.getElementById('carbohydrates_total_g').innerText;

    const foodDetails = {
        user_id: userId,
        category,
        date,
        food_name: foodName,
        serving_size: servingSize,
        calories,
        protein,
        fat,
        fiber,
        sugar,
        carbs
    };

    fetch('/NutriTrack/www/php/saveFoodDetails.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodDetails),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Food details saved successfully!');
            window.location.href = 'nutrition.html';
        } else {
            console.error('Error saving food details:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}
