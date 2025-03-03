import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WeatherInfo from "../components/WeatherInfo";
import DarkModeToggle from "../components/DarkModeToggle";
import "../styles/Weather.css";


const API_KEY = import.meta.env.VITE_OPEN_WEATHER_KEY;

const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lat, setLat] = useState(20);
    const [lon, setLon] = useState(0);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            setSidebarOpen(true);
            setWeather(response.data);
            setLat(lat);
            setLon(lon);
        } catch (err) {
            setSidebarOpen(false);
            toast.error("Failed to fetch weather data.");
        }
    };

    const fetchCity = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${API_KEY}`
            );
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                fetchWeather(lat, lon);
                setLat(lat);
                setLon(lon);
                return [lat, lon];
            } else {
                toast.error("City not found.");
            }
        } catch (err) {
            toast.error("Failed to fetch city data.");
        }
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                fetchWeather(lat, lng);
            },
        });
        return null;
    };

    const MapController = ({ lat, lon }) => {
        const map = useMap();
        if (lat && lon) {
            map.setView([lat, lon], 10);
        }
        return null;
    };

    // Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery) {
            fetchCity();
        }
    }, [debouncedQuery]);

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
            <div className="app-header">
                <p className={`header-title ${darkMode ? "dark-mode" : ""}`}>
                    <img
                        src="/weather_icon.svg"
                        alt="Weather Icon"
                        className="weather-icon"
                    />
                    Weather App
                </p>
                <div className={`search-bar ${darkMode ? "dark-mode" : ""}`}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        placeholder="Search for a city..."
                    />
                </div>
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                <MapController lat={lat} lon={lon} />
            </MapContainer>
            {sidebarOpen && <div className="sidebar">
                {weather && (
                    <WeatherInfo weather={weather} closeSidebar={() => setSidebarOpen(false)} />
                )}
            </div>}
        </div>
    );
};

export default WeatherApp;
