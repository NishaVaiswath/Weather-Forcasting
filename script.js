document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.querySelector('.container');
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherBox = document.querySelector('.weather-box');
    const weatherDetails = document.querySelector('.weather-details');
    const error404 = document.querySelector('.not-found');
    const cityHidden = document.getElementById('city-hidden');
    
    // Weather elements
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');

    // Weather image mapping
    const weatherImages = {
        'Clear': 'image/clear.png',
        'Rain': 'image/rain.png',
        'Snow': 'image/snow.png',
        'Clouds': 'image/cloud.png',
        'Mist': 'image/mist.png',
        'Haze': 'image/mist.png',
        'Fog': 'image/mist.png',
        'default': 'image/cloud.png'
    };

    // Fetch weather data
    async function fetchWeather(city) {
        try {
           
            const APIKey = '5d7ed230add4f106242b388d6d2ae969';
            
           
            const encodedCity = encodeURIComponent(city.trim());
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${APIKey}`
            );
            
            if (!response.ok) {
                throw new Error('Location not found');
            }
            
            const data = await response.json();
            
            // Additional validation
            if (!data || !data.main || !data.weather) {
                throw new Error('Invalid weather data');
            }
            
            updateWeatherUI(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            showError();
        }
    }

    // Update UI with weather data
    function updateWeatherUI(data) {
        const { main, weather, wind, name } = data;
        
        // Set weather icon
        weatherIcon.src = weatherImages[weather[0].main] || weatherImages['default'];
        
        // Update weather info
        temperature.innerHTML = `${Math.round(main.temp)}<span>°C</span>`;
        description.textContent = weather[0].description;
        humidity.textContent = `${main.humidity}%`;
        windSpeed.textContent = `${Math.round(wind.speed)}km/h`;
        cityHidden.textContent = name; // Store the normalized city name
        
        // Show weather info
        container.style.height = '555px';
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        error404.classList.remove('active');
    }

    // Show error state
    function showError() {
        container.style.height = '400px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        error404.classList.add('active');
    }

    // Event listeners
    searchBtn.addEventListener('click', searchWeather);
    
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });

    function searchWeather() {
        const city = cityInput.value.trim();
        if (city === '') {
            alert('Please enter a city name');
            return;
        }
        
        // Check if we're already showing this city's weather
        if (cityHidden.textContent.toLowerCase() === city.toLowerCase() && 
            !error404.classList.contains('active')) {
            return;
        }
        
        fetchWeather(city);
    }
});
