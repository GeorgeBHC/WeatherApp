const apiKey = '2167e5cc194afadef5e96d82f7768cc5'; 
const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
const saveWeatherBtn = document.getElementById('saveWeatherBtn');
const loadWeatherBtn = document.getElementById('loadWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');

fetchWeatherBtn.addEventListener('click', fetchWeather);
saveWeatherBtn.addEventListener('click', saveWeatherData);
loadWeatherBtn.addEventListener('click', loadWeatherData);

async function fetchWeather() {
    const city = cityInput.value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert('Error fetching weather data');
        console.error(error);
    }
}

function displayWeather(data) {
    weatherDisplay.innerHTML = '';
    const cityName = document.createElement('h2');
    cityName.textContent = data.city.name;
    weatherDisplay.appendChild(cityName);

    data.list.forEach((item) => {
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        
        const date = new Date(item.dt * 1000);
        weatherItem.innerHTML = `
            <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
            <p><strong>Temperature:</strong> ${item.main.temp} °C</p>
            <p><strong>Weather:</strong> ${item.weather[0].description}</p>
        `;
        
        weatherDisplay.appendChild(weatherItem);
    });
}

function saveWeatherData() {
    const weatherData = weatherDisplay.innerHTML;
    if (weatherData) {
        localStorage.setItem('weatherData', weatherData);
        alert('Weather data saved');
    } else {
        alert('No data to save');
    }
}

function loadWeatherData() {
    const savedWeatherData = localStorage.getItem('weatherData');
    if (savedWeatherData) {
        weatherDisplay.innerHTML = savedWeatherData;
    } else {
        alert('No saved data found');
    }
}
