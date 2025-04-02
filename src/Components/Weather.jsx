import React, { useState, useEffect } from "react";
import "./Weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Los Angeles");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError("");
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        
        const dailyForecast = data.list.filter((entry, index) => index % 8 === 0);

        setWeatherData(dailyForecast);
      } catch (error) {
        setError(error.message);
        setWeatherData(null);
      }
      setLoading(false);
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (city.trim()) {
      setCity(city);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city"
        />
        <button type="submit">Get Weather</button>
      </form>

      <h2>Weather in {city}</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="day-container">
        {weatherData && weatherData.slice(0, 5).map((day, index) => (
          <div key={index} className="weathercard">
            <h3>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
            <p>Temperature: {day.main.temp}°C</p>
            <p>Weather: {day.weather[0].description}</p>
            <p>Humidity: {day.main.humidity}%</p>
            <p>Wind Speed: {day.wind.speed} m/s</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
