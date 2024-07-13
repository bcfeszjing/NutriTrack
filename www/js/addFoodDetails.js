document.addEventListener('DOMContentLoaded', (event) => {
    // Set the current date
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

async function fetchFoodDetails() {
    const foodName = document.getElementById('foodName').value;
    const servingSize = document.getElementById('servingSize').value;
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
    document.getElementById('calories').innerText = foodDetails.calories;
    document.getElementById('protein_g').innerText = foodDetails.protein_g;
    document.getElementById('fat_total_g').innerText = foodDetails.fat_total_g;
    document.getElementById('fiber_g').innerText = foodDetails.fiber_g;
    document.getElementById('sugar_g').innerText = foodDetails.sugar_g;
    document.getElementById('carbohydrates_total_g').innerText = foodDetails.carbohydrates_total_g;
}

function saveFoodDetails() {
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const foodName = document.getElementById('foodName').value;
    const servingSize = document.getElementById('servingSize').value;
    const calories = document.getElementById('calories').innerText;
    const protein = document.getElementById('protein_g').innerText;
    const fat = document.getElementById('fat_total_g').innerText;
    const fiber = document.getElementById('fiber_g').innerText;
    const sugar = document.getElementById('sugar_g').innerText;
    const carbs = document.getElementById('carbohydrates_total_g').innerText;

    const foodDetails = {
        category,
        date,
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

    let savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];
    savedFoods.push(foodDetails);
    localStorage.setItem('savedFoods', JSON.stringify(savedFoods));

    alert('Food details saved successfully!');
}
