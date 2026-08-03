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

function updateWeatherUI(data) {
console.log(data.weather[0].main);
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
    changeWeatherVideo(data.weather[0].main);
}

// ==========================
// Search History Functions
// ==========================

function saveHistory(city) {

    // Remove duplicate city
    searchHistory = searchHistory.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    // Add new city at beginning
    searchHistory.unshift(city);

    // Keep only last 5 searches
    searchHistory = searchHistory.slice(0, 5);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(searchHistory)
    );

    displayHistory();
}


// Display search history buttons

function displayHistory() {

    historyContainer.innerHTML = "";

    searchHistory.forEach(city => {

        const button = document.createElement("button");

        button.textContent = city;

        button.classList.add("history-btn");


        button.addEventListener("click", () => {

            getWeather(city);

        });


        historyContainer.appendChild(button);

    });

}


// Clear all history

function clearHistory() {

    searchHistory = [];

    localStorage.removeItem("weatherHistory");

    displayHistory();

}

// ==========================
// Get Weather By City
// ==========================

async function getWeather(city) {

    loading.style.display = "block";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );


        const data = await response.json();


        if(data.cod != 200){

            throw new Error(data.message);

        }


        updateWeatherUI(data);


        saveHistory(data.name);


        getForecast(data.name);


    }

    catch(error){

        alert(error.message);

    }

    finally{

        loading.style.display = "none";

    }

}

// ==========================
// Get Weather By Location
// ==========================

async function getWeatherByLocation(lat, lon) {

    loading.style.display = "block";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );


        const data = await response.json();


        if(data.cod != 200){

            throw new Error(data.message);

        }


        updateWeatherUI(data);

        saveHistory(data.name);

        getForecast(data.name);


    }

    catch(error){

        alert(error.message);

    }

    finally{

        loading.style.display = "none";

    }

}



// ==========================
// 5 Day Forecast
// ==========================

async function getForecast(city){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );


        const data = await response.json();


        forecastContainer.innerHTML = "";


        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );


        dailyForecast.forEach(item => {


            const date = new Date(item.dt_txt);


            const day = date.toLocaleDateString(
                "en-US",
                {
                    weekday:"short"
                }
            );


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


    }

    catch(error){

        console.error(error);

    }

}



// ==========================
// Dynamic Background
// ==========================

function updateBackground(weather){


    document.body.className="";


    switch(weather){


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
// Weather Background Video
// ==========================

function changeWeatherVideo(weather){

    let videoURL="";


    switch(weather){


        case "Clear":

            videoURL="videos/sunny.mp4";

            break;


        case "Clouds":

            videoURL="videos/cloud.mp4";

            break;


        case "Rain":

        case "Drizzle":

            videoURL="videos/rain.mp4";

            break;


        case "Thunderstorm":

            videoURL="videos/storm.mp4";

            break;


        case "Snow":

            videoURL="videos/snow.mp4";

            break;


        default:

            videoURL="videos/cloud.mp4";

    }


    weatherVideo.src=videoURL;

    weatherVideo.load();

    weatherVideo.play();

}

// ==========================
// Event Listeners
// ==========================


searchBtn.addEventListener(
    "click",
    ()=>{


        const city =
        cityInput.value.trim();



        if(city === ""){

            alert("Enter city name");

            return;

        }


        getWeather(city);


        cityInput.value="";


    }
);




// Enter key search

cityInput.addEventListener(
    "keypress",
    (event)=>{


        if(event.key==="Enter"){

            searchBtn.click();

        }

    }
);




// Current location

locationBtn.addEventListener(
    "click",
    ()=>{


        if(!navigator.geolocation){

            alert(
            "Location not supported"
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            (position)=>{


                const lat =
                position.coords.latitude;


                const lon =
                position.coords.longitude;


                getWeatherByLocation(
                    lat,
                    lon
                );


            },


            ()=>{

                alert(
                "Unable to get location"
                );

            }

        );


    }
);




// Clear history

clearHistoryBtn.addEventListener(
    "click",
    clearHistory
);



// Load history when page opens

displayHistory();