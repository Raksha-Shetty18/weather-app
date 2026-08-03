// ===================================
// WeatherNow
// Hourly Forecast Module
// ===================================

async function getHourlyForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        hourlyContainer.innerHTML = "";

        const hourlyData = data.list.slice(0, 8);

        hourlyData.forEach(item => {

            const time = new Date(item.dt_txt);

            const hour = time.toLocaleTimeString("en-US", {

                hour: "numeric",

                hour12: true

            });

            hourlyContainer.innerHTML += `

                <div class="hour-card">

                    <h3>${hour}</h3>

                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

                    <p>${Math.round(item.main.temp)}°C</p>

                    <small>${item.weather[0].main}</small>

                </div>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}