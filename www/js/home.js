document.addEventListener('DOMContentLoaded', () => {
    const caloriesIntake = localStorage.getItem('caloriesIntake') || 0;
    const mealsList = JSON.parse(localStorage.getItem('mealsList')) || [];

    document.getElementById('calories-intake').innerText = `${caloriesIntake} kcal`;

    const mealsUl = document.getElementById('meals-list');
    mealsUl.innerHTML = '';
    mealsList.forEach(meal => {
        const li = document.createElement('li');
        li.innerText = meal;
        mealsUl.appendChild(li);
    });
});
