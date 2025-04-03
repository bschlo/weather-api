import React, { useState, useEffect } from "react";
import "./Weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("New York");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputCity, setInputCity] = useState("")

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError("");
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();

        const dailyForecast = data.list.filter(
          (entry, index) => index % 8 === 0
        );

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
    setInputCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity);
    }
  };

  const getWeatherImage = (description) => {
    if (description.includes("clear")) {
      return "day.svg";
    } else if (description.includes("cloud")) {
      return "cloudy-day-1.svg";
    } else if (description.includes("rain")) {
      return "rainy-4.svg";
    } else {
      return "day.svg";
    }
  };

  const capitilizeWords = (str) => {
    return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  return (
    <div className="main-container">
      <div className="top-half">
        <div className="overline">
          <div className="welcome-message">Welcome to The Weather API</div>
          <form onSubmit={handleSubmit}>
            <label>Type in your current city:</label>
            <div className="input-container">
              <input
                type="text"
                value={inputCity}
                onChange={handleCityChange}
                placeholder="Enter city"
              />
            </div>
            <button type="submit">Get Weather</button>
          </form>
        </div>

        <div className="weather-in">Weather in {capitilizeWords(city)}</div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="day-container">
        {weatherData &&
          weatherData.slice(0, 5).map((day, index) => (
            <div key={index} className="weathercard">
              <div className="header">
                <img
                  src={`../../img/${getWeatherImage(
                    day.weather[0].description
                  )}`}
                  alt="weather"
                  className="weather-image"
                />
                <div className="date">
                  <h3>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </h3>
                  <h4>{new Date(day.dt * 1000).toLocaleDateString()}</h4>
                </div>
              </div>
              <div className="description-container">
                <div className="items">
                  <div className="title">Temperature:</div>
                  <div className="value">{day.main.temp}°F</div>
                </div>
                <div className="items">
                  <div className="title">Weather:</div>
                  <div className="value">{day.weather[0].description}</div>
                </div>
                <div className="items">
                  <div className="title">Humidity:</div>
                  <div className="value">{day.main.humidity}%</div>
                </div>
                <div className="items">
                  <div className="title">Wind:</div>
                  <div className="value">{day.wind.speed} mph</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Weather;
