const apiKey = "ccc78afcaa8fab8361d03e3d3829767c";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const loading = document.getElementById("loading");

function updateWeatherUI(data) {
    document.getElementById("cityName").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind.speed} m/s`;

    document.getElementById("pressure").textContent =
        `${data.main.pressure} hPa`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.title = `${Math.round(data.main.temp)}°C - ${data.name}`;

    updateBackground(data.weather[0].main);
}

async function getWeather(city) {

    loading.style.display = "block";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        updateWeatherUI(data);

        await getForecast(data.name);

    } catch (error) {

        alert(error.message);

    } finally {

        loading.style.display = "none";

    }

}

async function getWeatherByLocation(lat, lon) {

    loading.style.display = "block";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        updateWeatherUI(data);

        await getForecast(data.name);

    } catch (error) {

        alert(error.message);

    } finally {

        loading.style.display = "none";

    }

}

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        const forecastContainer =
            document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(item => {

            const date = new Date(item.dt_txt);

            const day = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            forecastContainer.innerHTML += `
                <div class="forecast-card">
                    <h3>${day}</h3>

                    <img
                        src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
                        alt="Weather">

                    <p>${Math.round(item.main.temp)}°C</p>

                    <small>${item.weather[0].main}</small>
                </div>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

function updateBackground(weatherMain) {

    switch (weatherMain) {

        case "Clear":
            document.body.style.background =
                "linear-gradient(135deg,#4facfe,#00f2fe)";
            break;

        case "Clouds":
            document.body.style.background =
                "linear-gradient(135deg,#757f9a,#d7dde8)";
            break;

        case "Rain":
        case "Drizzle":
            document.body.style.background =
                "linear-gradient(135deg,#314755,#26a0da)";
            break;

        case "Thunderstorm":
            document.body.style.background =
                "linear-gradient(135deg,#232526,#414345)";
            break;

        case "Snow":
            document.body.style.background =
                "linear-gradient(135deg,#E6DADA,#274046)";
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            document.body.style.background =
                "linear-gradient(135deg,#606c88,#3f4c6b)";
            break;

        default:
            document.body.style.background =
                "linear-gradient(135deg,#1e3a8a,#0f172a)";
    }

}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    getWeather(city);

});

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            getWeatherByLocation(
                position.coords.latitude,
                position.coords.longitude
            );

        },

        () => {

            alert("Unable to get your location.");

        }

    );

});