const apiKey = '1051016c2ba82db0af421934639ae8fd'; // Replace with your actual API key

// Fetch location data based on city name
const fetchLocationData = (city) => {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    return fetch(geoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(locationData => {
            // If no location data is returned, throw an error
            if (locationData.length === 0) {
                throw new Error('City not found');
            }
            const { lat, lon } = locationData[0];
            return { lat, lon };
        });
};

// Fetch weather data based on latitude and longitude
const fetchWeatherData = (lat, lon) => {
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}&units=metric`; // Change 'units' to 'imperial' for Fahrenheit

    return fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        });
};

// Handle city search on button click
document.querySelector('.search-btn').addEventListener('click', () => {
    const city = document.querySelector('.city-input').value.trim();
    if (city === "") {
        alert('Please enter a city name');
        return;
    }

    fetchLocationData(city)
        .then(({ lat, lon }) => {
            return fetchWeatherData(lat, lon); // Fetch weather data
        })
        .then(weatherData => {
            // Update the weather info in HTML
            document.querySelector('.weather-info').style.display = 'block';
            document.querySelector('.country-text').textContent = city; // Display city name
            document.querySelector('.temp-text').textContent = `${weatherData.current.temp} °C`; // Current temperature
            document.querySelector('.condition-txt').textContent = weatherData.current.weather[0].description; // Weather condition
            document.querySelector('.humidity-value-txt').textContent = `${weatherData.current.humidity}%`; // Humidity
            document.querySelector('.wind-value-txt').textContent = `${weatherData.current.wind_speed} m/s`; // Wind speed
        })
        .catch(error => {
            console.error(error);
            document.querySelector('.not-found').style.display = 'block'; // Show not found message
            document.querySelector('.weather-info').style.display = 'none'; // Hide weather info
        });
});
