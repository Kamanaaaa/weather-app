
import { useState, useEffect } from "react";

function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
useEffect(() => {
  if (!city.trim()) {
    setWeather(null);
    setError("");
    setLoading(false);
    return;
  }

  let cancelled = false;

  async function fetchWeather() {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // 1. Find the city's coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Could not search for the city.");
      }

      const geoData = await geoResponse.json();
      const place = geoData.results?.[0];

      if (!place) {
        throw new Error("City not found. Try another city.");
      }

      // 2. Fetch weather using the coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Could not fetch weather data.");
      }

      const weatherData = await weatherResponse.json();

      if (!cancelled) {
        setWeather({
          location: place.name,
          country: place.country,
          current: weatherData.current,
        });
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchWeather();

  return () => {
    cancelled = true;
  };
}, [city]);


  return { weather, loading, error };
}

export default useWeather;
