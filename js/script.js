const tempElement = document.getElementById("temp");
const descElement = document.getElementById("desc");
const humidityElement = document.getElementById("humidity");
const windeElement = document.getElementById("wind");
const iconElement = document.getElementById("icon");

// Weather icon based on weathercode
function getWeatherIcon(code) {
  if ([0].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Clear
  if ([1, 2, 3].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // Partly cloudy
  if ([45, 48].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/4005/4005905.png"; // Fog
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/1163/1163620.png"; // Rain
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/642/642102.png"; // Snow
  if ([95, 96, 99].includes(code))
    return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; // Thunderstorm
  return "https://cdn-icons-png.flaticon.com/512/1116/1116453.png"; // Default
}

// Weather description in English
function getWeatherDescription(code) {
  switch (code) {
    case 0:
      return "Clear";
    case 1:
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Fog";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return "Rain";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "Snow";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Unknown";
  }
}

async function getWeather() {
  const cityName = document.getElementById("CityInput").value.trim();
  if (!cityName) return alert("Please enter a city name");

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1`
    );
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0)
      return alert("City not found");

    const { latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
    );
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;
    const currentHour = new Date().getHours();
    const humidity = weatherData.hourly.relativehumidity_2m[currentHour];

    tempElement.textContent = current.temperature + "°C";
    descElement.textContent = getWeatherDescription(current.weathercode);
    humidityElement.textContent = humidity + "%";
    windeElement.textContent = current.windspeed + " km/h";
    iconElement.src = getWeatherIcon(current.weathercode);
  } catch (error) {
    console.error(error);
    alert("Network error!");
  }
}

function showDefaultImage() {
  document.getElementById("default-img").style.display = "block";
  document.getElementById("icon").style.display = "none";
}

function hideDefaultImage() {
  document.getElementById("default-img").style.display = "none";
  document.getElementById("icon").style.display = "block";
}

document.querySelector("button").addEventListener("click", function () {
  const city = document.getElementById("CityInput").value;
  if (city.trim() === "") {
    showDefaultImage();
  } else {
    hideDefaultImage();
  }
});
