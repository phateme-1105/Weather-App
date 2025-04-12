const inputContainer = document.querySelector(".input-container");
const cityInput = document.querySelector(".city-input");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const container = document.querySelector(".container");
const apiKey = "1f48d5bb6a87f6454d2f6542fba532a0";

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

inputContainer.addEventListener("submit", (event) => {
  event.preventDefault();
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod !== 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  const weatherInfo = ` 
          <div class="location-date-container">
            <div class="location">
              <svg class="icon">
                <use href="./assets/sprite.svg#location_on"></use>
              </svg>
              <h4 class="country-text">${country}</h4>
            </div>
            <h5 class="current-date-text regular-text">${getCurrentDate()}</h5>
          </div>
          <div class="weather-summary-container" >
            <svg class="icon weather-summary-img ">
              <use href="./assets/sprite.svg#${getWeatherIcon(id)}"></use>
            </svg>
            <div class="weather-summary-info">
              <h1 class="temp-text">${Math.round(temp)} °C</h1>
              <h3 class="condition-text regular-text">${main}</h3>
            </div>
          </div>
          <div class="weather-conditions-container">
            <div class="condition-item">
             <svg class="icon"><use href="./assets/sprite.svg#water_drop"></use></svg>
              <div class="condition-info">
                <h5 class="regular-txt">Humidity</h5>
                <h5 class="humidity-value-text">${humidity}%</h5>
              </div>
            </div>
            <div class="condition-item">
             <svg class="icon"><use href="./assets/sprite.svg#air"></use></svg>
              <div class="condition-info">
                <h5 class="regular-txt">Wind Speed</h5>
                <h5 class="wind-value-text">${speed} M/s</h5>
              </div>
            </div>
          </div>`;

  container.innerHTML = weatherInfo;
  await updateForecastInfo(city);

  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
  <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
             <svg class="forecast-item-img">
              <use href="./assets/sprite.svg#${getWeatherIcon(id)}"></use>
            </svg>
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
  </div>
  `;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function getCurrentDate() {
  const currentDate = new Date();

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm";
  if (id <= 321) return "drizzle";
  if (id <= 531) return "rain";
  if (id <= 622) return "snow";
  if (id <= 781) return "atmosphere";
  if (id === 800) return "clear";
  else return "clouds";
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
