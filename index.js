
//result.data DATA FORMAT
// {
//   coord: { lon: -122.3301, lat: 47.6038 },
//   weather: [
//     { id: 601, main: 'Snow', description: 'snow', icon: '13n' },
//     { id: 701, main: 'Mist', description: 'mist', icon: '50n' }
//   ],
//   base: 'stations',
//   main: {
//     temp: 274.85,
//     feels_like: 272.41,
//     temp_min: 273.39,
//     temp_max: 276.36,
//     pressure: 1014,
//     humidity: 91
//   },
//   visibility: 4023,
//   wind: { speed: 2.24, deg: 154, gust: 3.58 },
//   snow: { '1h': 3.07 },
//   clouds: { all: 100 },
//   dt: 1709613269,
//   sys: {
//     type: 2,
//     id: 2041694,
//     country: 'US',
//     sunrise: 1709563387,
//     sunset: 1709603938
//   },
//   timezone: -28800,
//   id: 5809844,
//   name: 'Seattle',
//   cod: 200
// }

import express from "express"
import axios from "axios"

const port = 3000
const apiKey = "10053f2958b53ec8f94cef689093b473"
const units = "metric"
const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

const getWeatherFromCoordinates = (lat, lon, units) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
}
 
const getCoordinatesFromCity = (city_name, state_code = "", country_code = "") => {
   return `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state_code},${country_code}&limit=4&appid=${apiKey}`
}

app.get("/", async (req, res) => {
  const seattle_lat = 47.60
  const seattle_lon = -122.33
  const result = await axios.get(getWeatherFromCoordinates(seattle_lat, seattle_lon, units))
  console.log(result.data)
  res.render("index.ejs", {
    city_name: result.data.name,
    temperature: result.data.main.temp,
    description: result.data.weather[0].main,
    icon: result.data.weather[0].icon,
    humidity: result.data.main.humidity,
    wind_speed: result.data.wind.speed,
  })
})

app.post("/submit", async (req, res) => {
  console.log(req.body.city)
  const city_name = req.body.city
  const city = await axios.get(getCoordinatesFromCity(city_name))
  console.log(city.data[0])
  const lat = city.data[0].lat
  const lon = city.data[0].lon

  const city_weather = await axios.get(getWeatherFromCoordinates(lat, lon, units))

  res.render("index.ejs", {
    city_name: city_weather.data.name,
    temperature: city_weather.data.main.temp,
    description: city_weather.data.weather[0].main,
    icon: city_weather.data.weather[0].icon,
    humidity: city_weather.data.main.humidity,
    wind_speed: city_weather.data.wind.speed,
  })
})



app.listen(port, ()=> {
  console.log("listening on port " + port)
})

// let weather = {
  
//   fetchWeather: function (city) {
//     fetch(
//       "https://api.openweathermap.org/data/2.5/weather?q=" +
//         city +
//         "&units=" +
//         "metric" +
//         "&appid=" +
//         this.apiKey
//     )
//       .then((response) => response.json())
//       .then((data) => this.displayWeather(data));
//   },
//   displayWeather: function (data) {
//     const { name } = data;
//     const { temp, humidity } = data.main;
//     const { description, icon } = data.weather[0];
//     const { speed } = data.wind;
//     document.querySelector(".city").innerText = "Weather in " + name;
//     document.querySelector(".icon").src =
//       "https://openweathermap.org/img/wn/" + icon + "@2x.png";
//     document.querySelector(".temperature").innerText = temp.toFixed(1) + "°C";
//     document.querySelector(".humidity").innertext =
//       "Humidty: " + humidity + "%";
//     document.querySelector(".description").innerText = description;
//     document.querySelector(".wind").innerText =
//       "Wind speed: " + speed.toFixed(1) + "km/h";
//     document.querySelector(".weather").classList.remove("loading");
//     // document.body.style.backgroundImage =
//     //   "url('https://source.unsplash.com/random/?" + name + ", landscape')";

    // const myButton = document.querySelector(".unit-button");
    // let isF = true;
    // myButton.addEventListener("click", function () {
    //   if (isF) {
    //     myButton.innerText = "°C";
    //     myButton.classList.remove("C");
    //     myButton.classList.add("F");
    //     document.querySelector(".temperature").innerText =
    //       ((temp * 9) / 5 + 32).toFixed(1) + "°F";
    //     document.querySelector(".wind").innerText =
    //       "Wind speed: " + (speed / 1.609).toFixed(1) + "mph";
    //     isF = false;
    //   } else {
    //     myButton.innerText = "°F";
    //     myButton.classList.remove("F");
    //     myButton.classList.add("C");
    //     document.querySelector(".temperature").innerText =
    //       temp.toFixed(1) + "°C";
    //     document.querySelector(".wind").innerText =
    //       "Wind speed: " + speed.toFixed(1) + "km/h";
    //     isF = true;
    //   }
    // });

//   },
//   search: function () {
//     this.fetchWeather(document.querySelector(".search-bar").value);
//   },
// };

// document.querySelector(".search button").addEventListener("click", function () {
//   weather.search("metric");
// });

// document
//   .querySelector(".search-bar")
//   .addEventListener("keyup", function (event) {
//     if (event.key == "Enter") {
//       weather.search();
//     }
//   });

// weather.fetchWeather("appleton", "metric");



