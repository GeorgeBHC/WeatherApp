const apiKey = 'api.openweathermap.org/data/2.5/forecast?q={London}&appid={2167e5cc194afadef5e96d82f7768cc5}';
const weatherResult = document.getElementById('weatherResult');
const favoritesList = document.getElementById('favoritesList');
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                displayWeather(data);
            } else {
                weatherResult.innerHTML = '<p>City not found</p>';
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
    const city = data.city.name;
    const forecasts = data.list.slice(0, 5).map(forecast => {
        return `<p>${new Date(forecast.dt_txt).toLocaleString()}: ${forecast.weather[0].description}, Temp: ${forecast.main.temp}°C</p>`;
    }).join('');
    weatherResult.innerHTML = `
        <h2>Weather in ${city}</h2>
        ${forecasts}
        <button onclick="addFavorite('${city}')">Add to Favorites</button>
    `;
}

function addFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }
}

function removeFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => favorite !== city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = favorites.map(city => `
        <li>
            ${city}
            <button onclick="removeFavorite('${city}')">Remove</button>
        </li>
    `).join('');
}

// Initial render of favorites
renderFavorites();
