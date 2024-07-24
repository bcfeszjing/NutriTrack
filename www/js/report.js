// Function to toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to change the period and update the data
async function changePeriod(period = 'thisWeek') {
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
            navTitle.textContent = 'This Week';
            break;
    }

    const fetchedData = await fetchData(period);

    // Log fetched data for debugging
    console.log('Fetched Data:', fetchedData);

    updateChart(fetchedData, period);
    updateCategoryBreakdown(fetchedData);
    updateFoodSummary(fetchedData);
}

// Function to fetch data from the server
async function fetchData(period) {
    try {
        const response = await fetch(`php/report.php?period=${period}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
}

// Function to be called on page load to default to 'thisWeek'
window.onload = function() {
    changePeriod('thisWeek');
};

// Declare a variable to hold the chart instance globally
let nutritionChart;

// Function to update chart
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

    // Prepare chart data and options
    let chartData = {};
    let chartOptions = {};

    // Ensure the data mapping matches the structure returned by PHP
    if (chartType === 'pie') {
        chartData = {
            labels: [...new Set(data.map(item => item.category))],
            datasets: [{
                label: 'Calories (kcal)',
                data: [...new Set(data.map(item => item.calories))],
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
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

        chartData = {
            labels: daysOfWeek,
            datasets: categories.map((category, index) => ({
                label: category.charAt(0).toUpperCase() + category.slice(1),
                data: daysOfWeek.map(day => {
                    const dayData = data.filter(item => {
                        const itemDate = new Date(item.date);
                        return itemDate.getDay() === daysOfWeek.indexOf(day) && item.category === category;
                    });
                    return dayData.reduce((total, item) => total + parseFloat(item.calories), 0);
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
                    display: false
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

    nutritionChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}

// Function to update category breakdown
function updateCategoryBreakdown(data) {
    const categoryDetails = document.getElementById('categoryDetails');
    categoryDetails.innerHTML = '';

    const categories = ['breakfast', 'lunch', 'dinner', 'snack'];

    const totalCalories = categories.reduce((total, category) => {
        const categoryCalories = data.reduce((categoryTotal, item) => {
            return item.category === category ? categoryTotal + parseFloat(item.calories) : categoryTotal;
        }, 0);
        return total + categoryCalories;
    }, 0);

    categories.forEach(category => {
        const categoryCalories = data.reduce((categoryTotal, item) => {
            return item.category === category ? categoryTotal + parseFloat(item.calories) : categoryTotal;
        }, 0);

        const percentage = totalCalories === 0 ? 0 : ((categoryCalories / totalCalories) * 100).toFixed(2);

        const categoryRow = document.createElement('div');
        categoryRow.className = 'category-row';

        const categoryBox = document.createElement('div');
        categoryBox.className = 'category-box';
        categoryBox.style.backgroundColor = getCategoryColor(category);
        categoryRow.appendChild(categoryBox);

        const categoryTitle = document.createElement('span');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
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

// Function to update food summary
function updateFoodSummary(data) {
    const tableBody = document.querySelector('#foodTable tbody');
    let foodMap = new Map();

    tableBody.innerHTML = '';

    data.forEach(item => {
        const calories = parseFloat(item.calories);

        if (foodMap.has(item.food_name)) {
            let foodDetails = foodMap.get(item.food_name);
            foodDetails.timesEaten++;
            foodDetails.totalCalories += calories;
        } else {
            foodMap.set(item.food_name, {
                timesEaten: 1,
                totalCalories: calories
            });
        }
    });

    foodMap.forEach((details, foodName) => {
        let newRow = document.createElement('tr');
        newRow.innerHTML = 
            `<td>${foodName}</td>
            <td>${details.timesEaten}</td>
            <td>${details.totalCalories.toFixed(2)} kcal</td>`;
        tableBody.appendChild(newRow);
    });

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = 
        `<td><strong>Total</strong></td>
        <td></td>
        <td><strong>${Array.from(foodMap.values()).reduce((total, details) => total + details.totalCalories, 0).toFixed(2)} kcal</strong></td>`;
    tableBody.appendChild(totalRow);
}

function getCategoryColor(category) {
    switch (category) {
        case 'breakfast': return 'rgba(255, 99, 132, 0.6)';
        case 'lunch': return 'rgba(54, 162, 235, 0.6)';
        case 'dinner': return 'rgba(255, 206, 86, 0.6)';
        case 'snack': return 'rgba(75, 192, 192, 0.6)';
        default: return 'rgba(201, 203, 207, 0.6)';
    }
}


function goToGoalPage() {
    window.location.href = 'goal.html'; 
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/NutriTrack/www/php/getRDI.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('rdiValue').innerText = data.rdi + ' kcal';
            } else {
                console.error('Failed to fetch RDI:', data.message);
                document.getElementById('rdiValue').innerText = 'No RDI set';
            }
        })
        .catch(error => {
            console.error('Error fetching RDI:', error);
            document.getElementById('rdiValue').innerText = 'Error';
        });
});