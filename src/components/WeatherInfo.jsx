import React from 'react';

const WeatherInfo = ({ weather, closeSidebar }) => {
    return (
        <div className="weather-info">
            <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            <h2>{weather.name || "Unknown Location"}</h2>
            <table className="weather-table">
                <tbody>
                    <tr>
                        <td>Temperature:</td>
                        <td>{weather.main.temp}°C</td>
                    </tr>
                    <tr>
                        <td>Weather:</td>
                        <td>{weather.weather[0].description}</td>
                    </tr>
                    <tr>
                        <td>Humidity:</td>
                        <td>{weather.main.humidity}%</td>
                    </tr>
                    <tr>
                        <td>Wind Speed:</td>
                        <td>{weather.wind.speed} m/s</td>
                    </tr>
                </tbody>
            </table>
            <button className="close-sidebar" onClick={closeSidebar}>X</button>
        </div>
    );
};

export default WeatherInfo;