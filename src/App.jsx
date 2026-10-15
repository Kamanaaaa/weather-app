
import { useState } from "react";
import useWeather from "./hooks/useWeather";
import "./App.css";

function App() {
  const [city, setCity] = useState("Kathmandu");
  const [searchCity, setSearchCity] = useState("Kathmandu");

  const { weather, loading, error } = useWeather(city);

  function handleSearch(e) {
    e.preventDefault();

    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  }

  return (
    <div className="app">
      <h1>Weather App</h1>
      <p>Find the weather of your favorite city</p>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Enter city name..."
        />

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading weather...</p>}

      {error && <p className="error">{error}</p>}

      {weather && !loading && (
        <div className="weather-card">
          <h2>
            {weather.location}, {weather.country}
          </h2>

          <h1>{weather.current.temperature_2m}°C</h1>

          <p>Feels like: {weather.current.apparent_temperature}°C</p>

          <p>Humidity: {weather.current.relative_humidity_2m}%</p>

          <p>Wind speed: {weather.current.wind_speed_10m} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;
