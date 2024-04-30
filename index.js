import express from "express"
import axios from "axios"

const port = 3000
const apiKey = "10053f2958b53ec8f94cef689093b473"
const units = "metric"
const app = express()

/**
 * Middlewares
 **/
app.use(express.static("public"))//link static files
app.use(express.urlencoded({ extended: true })); //parse html forms
app.use(express.json()); //parse other json requests

const getWeatherFromCoordinates = (lat, lon, units = 'metric') => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
}

// const getWeatherWeek = (lat, lon, units = 'metric') =>{

// }
 
/**
 * 
 * @param {*} locationName 
 * @returns url endpoint used to fetch coordinated from given location
 */
const getCoordinatesFromCity = (locationName) => {
  const location = locationName.split(",").map(item => item.trim());
  const city_name = location[0] || ""
  const state_code = location[1] || ""
  const country_code = location[2] || ""
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state_code},${country_code}&limit=4&appid=${apiKey}`
}

/**
 * 
 * @param {*} city 
 * @param {*} state 
 * @param {*} country 
 * @returns a formated string of the full location name.
 */
const getFullLocation = (city, state = "", country = "") => {
  let res = city
  if (state){
    res = res + ", " + state
  }
  if (country){
    res = res + ", " + country
  }
  return res
}

/**
 * Landing page
 */
app.get("/", async (req, res) => {
  const seattle_lat = 47.60
  const seattle_lon = -122.33
  res.render("index.ejs")
})

/**
 * Fetches coordinates from location passed as user input from client side
 * Uses coordinates to fetch weather data and send it to client side.
 */
app.post("/submit", async (req, res) => {
  console.log("REQUEST", req.body.city)
  if (req.body.city){
    try{
      const url  = getCoordinatesFromCity(req.body.city)
      const coordinates = await axios.get(url)
  
      const lat = coordinates.data[0].lat
      const lon = coordinates.data[0].lon
      const city = coordinates.data[0].name
      const state = coordinates.data[0].state
      const country = coordinates.data[0].country
      const units = req.body.unit
  
      const city_weather = await axios.get(getWeatherFromCoordinates(lat, lon, units))
      // const week_weather = await axios.get()
      
      console.log(city_weather.data)
      const name = getFullLocation(city, state, country)
      res.render("index.ejs", {
        last_search: name,
        city_name: name,
        temperature: city_weather.data.main.temp,
        description: city_weather.data.weather[0].main,
        icon: city_weather.data.weather[0].icon,
        humidity: city_weather.data.main.humidity,
        wind_speed: city_weather.data.wind.speed,
        feels: city_weather.data.main.feels_like
      })
    }catch (error) {
      console.log(error.message)
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: "No activities that match your criteria.",
      });
    }
  }
  
})

/**
 * Fetches location names with user input as prefix to provide 
 * suggestions to user on client side. 
 */
app.post("/suggestions", async (req, res) => {
   console.log("REQUEST", req.body.data)
    const url  = getCoordinatesFromCity(req.body.data)
    const coordinates = await axios.get(url)
    const result = []
    for(let i = 0; i < 4; i ++){
      let city = coordinates.data[i]
      if (city){
        result.push(city.name + ", " + city.state + ", " + city.country )
      }
    }
    console.log(result)
    res.json({ message: 'Data received successfully', results: result });
})

app.listen(port, ()=> {
  console.log("listening on port " + port)
})

