const apiKey = "2d40d178ba1e3d155dc172d70b2a65fc";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const weatherVideo = document.getElementById("weatherVideo");

const loading = document.getElementById("loading");
const forecastContainer = document.getElementById("forecastContainer");
const historyContainer = document.getElementById("historyContainer");

let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// ==========================
// Update Weather UI
// ==========================

function updateWeatherUI(data) {
  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("description").textContent =
    data.weather[0].description;

  document.getElementById("humidity").textContent = `${data.main.humidity}%`;

  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;

  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

  document.getElementById("feelsLike").textContent =
    `${Math.round(data.main.feels_like)}°C`;

  // ==========================
  // Extra Weather Details
  // ==========================

  document.getElementById("sunrise").textContent = new Date(
    data.sys.sunrise * 1000,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("sunset").textContent = new Date(
    data.sys.sunset * 1000,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("visibility").textContent =
    `${data.visibility / 1000} km`;

  document.getElementById("minmax").textContent =
    `${Math.round(data.main.temp_min)}° /
        ${Math.round(data.main.temp_max)}°`;

  document.getElementById("windDirection").textContent = `${data.wind.deg}°`;

  // Weather Icon

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.title = `${Math.round(data.main.temp)}°C - ${data.name}`;

  updateBackground(data.weather[0].main);

  changeWeatherVideo(data.weather[0].main);
}

// ==========================
// Search History
// ==========================

function saveHistory(city) {
  searchHistory = searchHistory.filter(
    (item) => item.toLowerCase() !== city.toLowerCase(),
  );

  searchHistory.unshift(city);

  searchHistory = searchHistory.slice(0, 5);

  localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));

  displayHistory();
}

function displayHistory() {
  historyContainer.innerHTML = "";

  searchHistory.forEach((city) => {
    const button = document.createElement("button");

    button.textContent = city;

    button.classList.add("history-btn");

    button.onclick = () => {
      getWeather(city);
    };

    historyContainer.appendChild(button);
  });
}

function clearHistory() {
  searchHistory = [];

  localStorage.removeItem("weatherHistory");

  displayHistory();
}

// ==========================
// Weather By City
// ==========================

async function getWeather(city) {
  loading.style.display = "block";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );

    const data = await response.json();

    if (data.cod != 200) {
      throw new Error(data.message);
    }

    updateWeatherUI(data);

    saveHistory(data.name);

    getForecast(data.name);
  } catch (error) {
    alert(error.message);
  } finally {
    loading.style.display = "none";
  }
}

// ==========================
// Weather By Location
// ==========================

async function getWeatherByLocation(lat, lon) {
  loading.style.display = "block";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );

    const data = await response.json();

    if (data.cod != 200) {
      throw new Error(data.message);
    }

    updateWeatherUI(data);

    saveHistory(data.name);

    getForecast(data.name);
  } catch (error) {
    alert(error.message);
  } finally {
    loading.style.display = "none";
  }
}

// ==========================
// 5 Day Forecast
// ==========================

async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
    );

    const data = await response.json();

    forecastContainer.innerHTML = "";

    const dailyForecast = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00"),
    );

    dailyForecast.forEach((item) => {
      const day = new Date(item.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h3>${day}</h3>

                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

                <p>${Math.round(item.main.temp)}°C</p>

                <small>
                ${item.weather[0].main}
                </small>

            </div>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

// ==========================
// Background Video
// ==========================

function changeWeatherVideo(weather) {
  let videoURL = "";

  switch (weather) {
    case "Clear":
      videoURL = "videos/sunny.mp4";

      break;

    case "Clouds":
      videoURL = "videos/cloud.mp4";

      break;

    case "Rain":
    case "Drizzle":
      videoURL = "videos/rain.mp4";

      break;

    case "Thunderstorm":
      videoURL = "videos/storm.mp4";

      break;

    case "Snow":
      videoURL = "videos/snow.mp4";

      break;

    default:
      videoURL = "videos/cloud.mp4";
  }

  weatherVideo.src = videoURL;

  weatherVideo.load();

  weatherVideo.play();
}

// ==========================
// Background Class
// ==========================

function updateBackground(weather) {
  document.body.className = "";

  switch (weather) {
    case "Clear":
      document.body.classList.add("sunny");

      break;

    case "Clouds":
      document.body.classList.add("cloudy");

      break;

    case "Rain":
    case "Drizzle":
      document.body.classList.add("rainy");

      break;

    case "Thunderstorm":
      document.body.classList.add("stormy");

      break;

    case "Snow":
      document.body.classList.add("snowy");

      break;

    default:
      document.body.classList.add("cloudy");
  }
}

// ==========================
// Events
// ==========================

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Enter city name");

    return;
  }

  getWeather(city);

  cityInput.value = "";
});

cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherByLocation(position.coords.latitude, position.coords.longitude);
    },

    () => {
      alert("Unable to get location");
    },
  );
});

clearHistoryBtn.addEventListener("click", clearHistory);

displayHistory();
