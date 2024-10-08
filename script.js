const apiKey = 'your_api_key_here';
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const forecastContainer = document.createElement('div');  // New forecast container

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (!city) return;

    // First, get latitude and longitude from city name using geocoding API
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(locationData => {
            if (locationData.length === 0) {
                notFoundSection.style.display = 'block';
                weatherInfoSection.style.display = 'none';
                return;
            }

            const { lat, lon, name, country } = locationData[0];

            // Fetch weather and forecast data using OneCall API 3.0
            const forecastApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;

            return fetch(forecastApiUrl).then(response => response.json()).then(forecastData => {
                updateWeatherInfo(forecastData, name, country);
                updateForecastInfo(forecastData);
            });
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

function updateWeatherInfo(data, cityName, countryCode) {
    const countryText = document.querySelector('.country-text');
    const tempText = document.querySelector('.temp-text');
    const conditionText = document.querySelector('.condition-txt');
    const humidityText = document.querySelector('.humidity-value-txt');
    const windText = document.querySelector('.wind-value-txt');

    // Use current data from OneCall API
    const currentWeather = data.current;

    countryText.textContent = `${cityName}, ${countryCode}`;
    tempText.textContent = `${Math.round(currentWeather.temp)} °C`;
    conditionText.textContent = currentWeather.weather[0].description;
    humidityText.textContent = `${currentWeather.humidity}%`;
    windText.textContent = `${currentWeather.wind_speed} m/s`;

    // Show the weather info section
    notFoundSection.style.display = 'none';
    searchCitySection.style.display = 'none';
    weatherInfoSection.style.display = 'block';
}

function updateForecastInfo(data) {
    // Clear existing forecast data
    forecastContainer.innerHTML = '';

    const dailyForecast = data.daily.slice(1, 4); // Get next 3 days

    dailyForecast.forEach(day => {
        const forecastDate = new Date(day.dt * 1000).toLocaleDateString();
        const tempDay = Math.round(day.temp.day);
        const tempNight = Math.round(day.temp.night);
        const description = day.weather[0].description;

        const forecastHTML = `
            <div class="forecast-day">
                <h5>${forecastDate}</h5>
                <p>Day: ${tempDay} °C, Night: ${tempNight} °C</p>
                <p>${description}</p>
            </div>
        `;

        forecastContainer.innerHTML += forecastHTML;
    });

    // Append forecast container to weather info section
    weatherInfoSection.appendChild(forecastContainer);
}
