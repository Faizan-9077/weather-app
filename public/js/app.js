var weatherApi = "./weather";
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');
const weatherDetails = document.querySelector(".icon-and-weatherInfo");

const currentDate = new Date();
const options = {month: "long"};
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = currentDate.getDate() + ", " + monthName;

if("geolocation" in navigator) {
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
            fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if(data && data.address && data.address.city) {
                    const city = data.address.city;
                    showData(city);
                } 
                else{
                    console.log("City not found.")
                    weatherDetails.style.display = "none";
                }
            })
            .catch((error) => {
                console.log(error);
            });
        },
        function(error) {
            console.log(error.message);
        }
    );
}
else{
    console.log("Geolocation is not available on this browser.");
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    locationElement.textContent = "Loading...";
    weatherIcon.className = "";
    tempElement.className = "";
    weatherCondition.className = "";
    weatherDetails.style.display = "block";

    showData(search.value);
});

function showData(city) {
    getWeatherData(city, (result) => {
        if (result.cod == 200) {
            weatherDetails.style.display = "block";
            // Mapping OpenWeather descriptions to Weather Icons
            const weatherMapping = {
                "clear sky": "wi-day-sunny",
                "few clouds": "wi-day-cloudy",
                "scattered clouds": "wi-cloud",
                "broken clouds": "wi-cloudy",
                "overcast clouds": "wi-cloudy",
                "shower rain": "wi-showers",
                "rain": "wi-rain",
                "thunderstorm": "wi-thunderstorm",
                "snow": "wi-snow",
                "mist": "wi-fog",
                "fog": "wi-fog",
                "haze": "wi-day-haze",
                "smoke": "wi-smoke",
                "drizzle": "wi-sprinkle"
            };

            // Get the weather description in lowercase for matching
            let description = result.weather[0].description.toLowerCase();
            
            // Set the corresponding icon class
            weatherIcon.className = `wi ${weatherMapping[description] || "wi-day-cloudy"}`;

            // Set other weather details
            locationElement.textContent = result?.name;
            tempElement.textContent = (result?.main?.temp - 273.15).toFixed(2) + String.fromCharCode(176) + "C";
            weatherCondition.textContent = description.toUpperCase();
        } else {
            locationElement.textContent = "City not found.";
            weatherDetails.style.display = "none";
        }
    });
}

function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + city;
    fetch(locationApi).then((response) => {
        response.json().then((response) => {
            callback(response);
        });
    });
}