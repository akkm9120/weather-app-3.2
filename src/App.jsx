import logo from "/logo.png";
import "./App.css";
import axios from "axios";

import { useState } from "react";

// Hard-coding API keys in code is insecure behaviour and we are only doing this for teaching purposes.
// After we learn backend, we should store all API keys in server-side environment variables.
const OPEN_WEATHER_API_KEY = "5e2c42142c1cafc732b8ad33fc1ba456";

function App() {
  const [cityInputValue, setCityInputValue] = useState("");
  const [currCity, setCurrCity] = useState("");
  const [currTemp, setCurrTemp] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [weatherDesc, setWeatherDesc] = useState("");
  const [weatherIconCode, setWeatherIconCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityInputValue}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      )
      .then((response) => {
        console.log('Geo API Response:', response.data);
        return response.data[0];
      })
      .then((cityGeoData) => {
        console.log('City Geo Data:', cityGeoData);
        return axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
        )
      })
      .then((response) => {
        console.log('Weather API Response:', response.data);
        const { data: weatherData } = response;

        // Reset input value after submit
        setCityInputValue("");
        setCurrCity(weatherData.name);
        setCurrTemp(weatherData.main.temp);
        setWeatherType(weatherData.weather[0].main);
        setWeatherDesc(weatherData.weather[0].description);
        setWeatherIconCode(weatherData.weather[0].icon);
      });
  };
  const weatherInfo = currCity ? (
    <div>
      <img
        src={`https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`}
        alt="weather-icon"
      />
      <p>Current City: {currCity}</p>
      <p>Current Temperature: {currTemp}°C</p>
      <p>
        Current Weather: {weatherType}, {weatherDesc}
      </p>
    </div>
  ) : (
    <p>Please enter a city name to get its weather data.</p>
  );

  return (
    <>
      <div>
        <img src={logo} className="logo react" alt="Rocket logo" />
      </div>
      <h1>Weather App</h1>
      <div className="weather-card">
        <form onSubmit={handleSubmit}>
          <label>
            {"City: "}
            <input
              type="text"
              value={cityInputValue}
              onChange={(e) => setCityInputValue(e.target.value)}
            />
          </label>
          <br />
          <input type="submit" value="Check Weather" />
        </form>
        {weatherInfo}
      </div>
    </>
  );
}

export default App;