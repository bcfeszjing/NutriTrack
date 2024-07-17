// Update changePeriod function to default to 'thisWeek' on page load
function changePeriod(period = 'thisWeek') {
    // Update navigation title
    const navTitle = document.getElementById('nav-title');
    switch (period) {
        case 'today':
            navTitle.textContent = 'Today';
            break;
        case 'yesterday':
            navTitle.textContent = 'Yesterday';
            break;
        case 'thisWeek':
            navTitle.textContent = 'This Week';
            break;
        case 'lastWeek':
            navTitle.textContent = 'Last Week';
            break;
        default:
            break;
    }

    // Fetch data from localStorage or wherever your data is stored
    const savedFoods = JSON.parse(localStorage.getItem('savedFoods')) || [];

    // Filter data based on the selected period logic
    let filteredData = [];
    switch (period) {
        case 'today':
            filteredData = filterDataByDate(savedFoods, getFormattedDate(new Date()));
            break;
        case 'yesterday':
            filteredData = filterDataByDate(savedFoods, getFormattedDate(getPreviousDate(1)));
            break;
        case 'thisWeek':
            filteredData = filterDataByThisWeek(savedFoods);
            break;
        case 'lastWeek':
            filteredData = filterDataByLastWeek(savedFoods);
            break;
        default:
            break;
    }

    // Update the UI components (chart, category breakdown, food summary)
    updateChart(filteredData, period);
    updateCategoryBreakdown(filteredData);
    updateFoodSummary(filteredData);
}

// Function to be called on page load to default to 'thisWeek'
window.onload = function() {
    changePeriod('thisWeek');
};

let nutritionChart; // Declare a variable to hold the chart instance globally

// Updated updateChart function to determine chart type based on period
function updateChart(data, period) {
    const ctx = document.getElementById('nutritionChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (nutritionChart) {
        nutritionChart.destroy();
    }

    // Determine chart type based on period
    let chartType = 'bar';
    if (period === 'today' || period === 'yesterday') {
        chartType = 'pie';
    }

    // Prepare chart data based on data retrieved
    let chartData = {};
    let chartOptions = {};

    if (chartType === 'pie') {
        // Pie chart data
        chartData = {
            labels: data.map(item => item.category),
            datasets: [{
                label: 'Calories (kcal)',
                data: data.map(item => parseFloat(item.nutrition.calories)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        };

        chartOptions = {
            responsive: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kcal`;
                        }
                    }
                }
            }
        };
    } else {
        // Stacked bar chart data
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

        // Initialize data structure for stacked bar chart
        chartData = {
            labels: daysOfWeek,
            datasets: categories.map((category, index) => ({
                label: category.charAt(0).toUpperCase() + category.slice(1),
                data: daysOfWeek.map(day => {
                    const dayData = data.filter(item => {
                        const itemDate = new Date(item.date);
                        return itemDate.getDay() === daysOfWeek.indexOf(day) && item.category === category;
                    });
                    return dayData.reduce((total, item) => total + parseFloat(item.nutrition.calories), 0);
                }),
                backgroundColor: getCategoryColor(category),
                stack: 'Stack 0',
                borderWidth: 1
            }))
        };

        chartOptions = {
            responsive: false,
            plugins: {
                legend: {
                    display: false // Hide legend for stacked bar chart
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label || '';
                            const value = tooltipItem.formattedValue;
                            return `${datasetLabel}: ${value} kcal`;
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    }
                }
            }
        };
    }

    // Render the chart
    nutritionChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}


// Toggle dropdown visibility
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.classList.toggle('show');
}

// Function to close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};


// Function to filter data by date
function filterDataByDate(data, date) {
    return data.filter(item => item.date === date);
}

// Function to filter data for this week
function filterDataByThisWeek(data) {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = getEndOfWeek(today);
    return data.filter(item => new Date(item.date) >= startOfWeek && new Date(item.date) <= endOfWeek);
}

// Function to filter data for last week
function filterDataByLastWeek(data) {
    const today = new Date();
    const startOfLastWeek = getStartOfLastWeek(today);
    const endOfLastWeek = getEndOfLastWeek(today);
    return data.filter(item => new Date(item.date) >= startOfLastWeek && new Date(item.date) <= endOfLastWeek);
}

// Function to get formatted date
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}

// Function to get previous date
function getPreviousDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

// Function to get start of the week
function getStartOfWeek(date) {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
}

// Function to get end of the week
function getEndOfWeek(date) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
}

// Function to get start of last week
function getStartOfLastWeek(date) {
    const startOfWeek = getStartOfWeek(date);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    return startOfWeek;
}

// Function to get end of last week
function getEndOfLastWeek(date) {
    const endOfWeek = getEndOfWeek(getStartOfLastWeek(date));
    return endOfWeek;
}
// Function to update category breakdown
function updateCategoryBreakdown(data) {
    const categoryDetails = document.getElementById('categoryDetails');
    categoryDetails.innerHTML = '';

    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    // Calculate total calories for all categories
    const totalCalories = categories.reduce((total, category) => {
        const categoryCalories = data.reduce((categoryTotal, item) => {
            return item.category === category ? categoryTotal + parseFloat(item.nutrition.calories) : categoryTotal;
        }, 0);
        return total + categoryCalories;
    }, 0);

    // Update category rows with percentages and calories
    categories.forEach(category => {
        const categoryCalories = data.reduce((categoryTotal, item) => {
            return item.category === category ? categoryTotal + parseFloat(item.nutrition.calories) : categoryTotal;
        }, 0);

        // Calculate percentage for the category
        const percentage = totalCalories === 0 ? 0 : ((categoryCalories / totalCalories) * 100).toFixed(2);

        // Create category row
        const categoryRow = document.createElement('div');
        categoryRow.className = 'category-row';

        const categoryBox = document.createElement('div');
        categoryBox.className = 'category-box';
        categoryBox.style.backgroundColor = getCategoryColor(category); // Function to get color based on category
        categoryRow.appendChild(categoryBox);

        const categoryTitle = document.createElement('span');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
        categoryRow.appendChild(categoryTitle);

        const categoryPercentage = document.createElement('span');
        categoryPercentage.className = 'category-percentage';
        categoryPercentage.textContent = `${percentage}%`;
        categoryRow.appendChild(categoryPercentage);

        const categoryCaloriesSpan = document.createElement('span');
        categoryCaloriesSpan.className = 'category-calories';
        categoryCaloriesSpan.textContent = `${categoryCalories.toFixed(2)} kcal`;
        categoryRow.appendChild(categoryCaloriesSpan);

        categoryDetails.appendChild(categoryRow);
    });


    // Display total calories
    const totalCaloriesRow = document.createElement('div');
    totalCaloriesRow.className = 'total-calories-row';

    const totalCaloriesLabel = document.createElement('span');
    totalCaloriesLabel.className = 'total-calories-label';
    totalCaloriesLabel.textContent = 'Total Calories:';
    totalCaloriesRow.appendChild(totalCaloriesLabel);

    const totalCaloriesValue = document.createElement('span');
    totalCaloriesValue.className = 'total-calories-value';
    totalCaloriesValue.textContent = `${totalCalories.toFixed(2)} kcal`;
    totalCaloriesRow.appendChild(totalCaloriesValue);

    categoryDetails.appendChild(totalCaloriesRow);
}

function updateFoodSummary(data) {
    const tableBody = document.querySelector('#foodTable tbody');
    let foodMap = new Map(); // Using a map to track food items and their details

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate through the data to update the table and calculate total calories
    data.forEach(item => {
        // Ensure item.calories is parsed as a float to avoid NaN errors
        const calories = parseFloat(item.nutrition.calories);

        if (foodMap.has(item.foodName)) {
            // If foodName already exists in the map, update details
            let foodDetails = foodMap.get(item.foodName);
            foodDetails.timesEaten++;
            foodDetails.totalCalories += calories; // Use parsed calories
        } else {
            // If foodName does not exist in the map, initialize details
            foodMap.set(item.foodName, {
                timesEaten: 1,
                totalCalories: calories // Use parsed calories
            });
        }
    });

    // Rebuild the table rows based on the updated foodMap
    foodMap.forEach((details, foodName) => {
        let newRow = document.createElement('tr');
        newRow.setAttribute('data-food', foodName);

        let foodCell = document.createElement('td');
        foodCell.textContent = foodName;

        let timesEatenCell = document.createElement('td');
        timesEatenCell.textContent = `x${details.timesEaten}`;

        let caloriesCell = document.createElement('td');
        caloriesCell.textContent = details.totalCalories.toFixed(2); // Ensure toFixed for formatting

        newRow.appendChild(foodCell);
        newRow.appendChild(timesEatenCell);
        newRow.appendChild(caloriesCell);

        tableBody.appendChild(newRow);
    });

    // Add total row if there are food items
    if (foodMap.size > 0) {
        const totalCalories = Array.from(foodMap.values()).reduce((acc, curr) => acc + curr.totalCalories, 0).toFixed(2);
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td>Total</td>
            <td></td>
            <td>${totalCalories}</td>
        `;
        tableBody.appendChild(totalRow);
    } else {
        // If no data available, display a message or handle accordingly
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 3;
        emptyCell.textContent = 'No data available.';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    }

    // Return foodMap to access in other parts of your application
    return foodMap;
}


// Function to get category color
function getCategoryColor(category) {
    switch (category) {
        case 'breakfast':
            return 'rgba(255, 99, 132, 0.6)';
        case 'lunch':
            return 'rgba(54, 162, 235, 0.6)';
        case 'dinner':
            return 'rgba(255, 206, 86, 0.6)';
        case 'snack':
            return 'rgba(75, 192, 192, 0.6)';
        default:
            return 'rgba(255, 99, 132, 0.6)';
    }
}

function goToGoalPage() {
    window.location.href = 'goal.html'; 
}

let rdi = localStorage.getItem('rdi');
document.getElementById('rdiValue').innerText = rdi + 'kcal';