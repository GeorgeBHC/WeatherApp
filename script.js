// cheia api
const apiKey = '2167e5cc194afadef5e96d82f7768cc5'; 

// elemente dom
const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
const saveWeatherBtn = document.getElementById('saveWeatherBtn');
const loadWeatherBtn = document.getElementById('loadWeatherBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const backToSearchBtn = document.getElementById('backToSearchBtn');
const header = document.querySelector('h1');
const currentTime = document.getElementById('currentTime');
const currentWeather = document.getElementById('currentWeather');

// functiile de click
fetchWeatherBtn.addEventListener('click', fetchWeather);
saveWeatherBtn.addEventListener('click', saveWeatherData);
loadWeatherBtn.addEventListener('click', loadWeatherData);
backToSearchBtn.addEventListener('click', backToSearch);

// traducere vreme in romana
const weatherTranslations = {
    "clear sky": "cer senin",
    "few clouds": "puțini nori",
    "scattered clouds": "nori imprastiati",
    "broken clouds": "innorat",
    "shower rain": "averse de ploaie",
    "rain": "ploaie",
    "thunderstorm": "furtună",
    "snow": "zăpadă",
    "mist": "ceață",
    "drizzle": "ploaie ușoară",
    "light rain": "ploaie slabă",
    "heavy rain": "ploaie torențială",
    "light snow": "zăpadă ușoară",
    "heavy snow": "zăpadă abundentă",
    "fog": "ceață densă",
    "haze": "ceață ușoară",
};

function translateWeather(description) {
    return weatherTranslations[description] || description;
}

// ia datele de pe site
async function fetchWeather() {
    const city = cityInput.value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ro`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
        displayCurrentWeather(data);
    } catch (error) {
        alert('Error fetching weather data');
        console.error(error);
    }
}

// zilele sapt
function getDayOfWeek(date) {
    const daysOfWeek = ['Joi', 'Vineri', 'Sâmbătă', 'Duminică', 'Luni', 'Marți', 'Miercuri'];
    return daysOfWeek[date.getDay()];
}

// arata datele pe zile 
function displayWeather(data) {
    weatherDisplay.innerHTML = '';
    header.textContent = data.city.name; 

    const groupedData = new Map();

    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString();
        if (!groupedData.has(day)) {
            groupedData.set(day, item); 
        }
    });

    const daysOfWeek = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    const today = new Date();
    const displayedDays = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = getDayOfWeek(date);
        const dateString = date.toLocaleDateString();
        const item = groupedData.get(dateString) || { main: { temp: 'N/A' }, weather: [{ description: 'N/A' }] };

        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather-card');

        weatherCard.innerHTML = `
            <h3>${dayName}</h3>
            <p><strong>Data:</strong> ${dateString}</p>
            <p><strong>Temperatură:</strong> ${item.main.temp} °C</p>
            <p><strong>Prognoza:</strong> ${translateWeather(item.weather[0].description)}</p>
        `;

        weatherDisplay.appendChild(weatherCard);
        displayedDays.push(dayName);
    }

    document.querySelector('.input-container').classList.add('hidden');
    backToSearchBtn.classList.remove('hidden');
}

function displayCurrentWeather(data) {
    const current = data.list[0];
    const date = new Date(current.dt * 1000);

    currentWeather.innerHTML = `
        <p><strong>Ora:</strong> ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Temperatură:</strong> ${current.main.temp} °C</p>
        <p><strong>Prognoza:</strong> ${translateWeather(current.weather[0].description)}</p>
    `;
}

// salveaza datele in local storage
function saveWeatherData() {
    const weatherData = weatherDisplay.innerHTML;
    if (weatherData) {
        localStorage.setItem('weatherData', weatherData);
        alert('Weather data saved');
    } else {
        alert('No data to save');
    }
}


// load la datele din storage
function loadWeatherData() {
    const savedWeatherData = localStorage.getItem('weatherData');
    if (savedWeatherData) {
        weatherDisplay.innerHTML = savedWeatherData;
    } else {
        alert('No saved data found');
    }
}

// inapoi la pagina de search
function backToSearch() {
    weatherDisplay.innerHTML = '';
    header.textContent = 'Weather App'; 
    document.querySelector('.input-container').classList.remove('hidden');
    backToSearchBtn.classList.add('hidden');
}

// actualizeaza ora curenta
function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

setInterval(updateTime, 1000);
updateTime();
