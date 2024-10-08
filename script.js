const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfo = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

// OpenWeatherMap API key
const apiKey = '1051016c2ba82db0af421934639ae8fd';

// Fetch weather data from OpenWeatherMap
async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


function updateWeatherUI(data) {
    const countryText = document.querySelector('.country-text');
    const tempText = document.querySelector('.temp-text');
    const conditionText = document.querySelector('.condition-txt');
    const humidityValue = document.querySelector('.humidity-value-txt');
    const windValue = document.querySelector('.wind-value-txt');
    const weatherIcon = document.querySelector('.weather-summary-img');

    // Update values with data
    countryText.textContent = data.name;
    tempText.textContent = `${data.main.temp} °C`;
    conditionText.textContent = data.weather[0].description;
    humidityValue.textContent = `${data.main.humidity}%`;
    windValue.textContent = `${data.wind.speed} m/s`;

    // Weather icon (based on conditions)
    const weatherIconCode = data.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

    // Show the weather info
    searchCitySection.style.display = 'none';
    weatherInfo.style.display = 'flex';
    notFoundSection.style.display = 'none';
}

// Handle the search button click
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        const data = await fetchWeather(city);
        if (data) {
            updateWeatherUI(data);
        } else {
            // If city not found, show 'not found' section
            searchCitySection.style.display = 'none';
            weatherInfo.style.display = 'none';
            notFoundSection.style.display = 'flex';
        }
        cityInput.value = '';
        cityInput.blur();
    }
});


cityInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city !== '') {
            const data = await fetchWeather(city);
            if (data) {
                updateWeatherUI(data);
            } else {
                searchCitySection.style.display = 'none';
                weatherInfo.style.display = 'none';
                notFoundSection.style.display = 'flex';
            }
            cityInput.value = '';
            cityInput.blur();
        }
    }
});
