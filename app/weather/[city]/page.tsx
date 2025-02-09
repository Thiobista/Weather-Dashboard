"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWeather } from "@/store/weatherSlice";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  sys: { sunrise: number; sunset: number };
}

export default function CityWeather() {
  const params = useParams();
  const city = Array.isArray(params.city) ? params.city[0] : params.city;
  const dispatch = useAppDispatch();
  const { weather, loading, error } = useAppSelector(
    (state) => state.weather as { weather: WeatherData | null; loading: boolean; error: string | null }
  );

  const [isCelsius, setIsCelsius] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (city) dispatch(fetchWeather(city));
  }, [city, dispatch]);

  const toggleTemperatureUnit = () => setIsCelsius((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const convertTemperature = (temp: number) => (isCelsius ? temp : (temp * 9) / 5 + 32);

  const formatTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString();

  if (loading)
    return <p className="text-white text-xl text-center mt-10 animate-pulse">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-xl text-center mt-10 bg-red-900 p-4 rounded-lg">{error}</p>;

  return weather ? (
    <div
      className={`flex justify-center items-center min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-blue-600 to-indigo-900 text-white"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative p-10 rounded-3xl shadow-3xl max-w-4xl w-full mx-6 sm:mx-8 md:mx-12 lg:mx-auto border border-white/20 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="absolute top-4 right-4 p-2 rounded-full bg-gray-600 hover:bg-gray-800 transition">
          {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-blue-500" />}
        </button>

        {/* City Name */}
        <h1 className="text-5xl font-extrabold text-center drop-shadow-md">{weather.name}</h1>

        {/* Weather Icon */}
        <div className="flex flex-col items-center mt-6">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
          <p className="text-xl font-medium capitalize mt-2">{weather.weather[0].description}</p>
        </div>

        {/* Weather Details */}
        <div className="mt-6 space-y-4 text-center">
          <motion.p
            key={isCelsius ? "Celsius" : "Fahrenheit"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-semibold"
          >
            {convertTemperature(weather.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}
          </motion.p>
          <p className="text-lg">Feels Like: <span className="font-semibold">{convertTemperature(weather.main.feels_like).toFixed(1)}°{isCelsius ? "C" : "F"}</span></p>
          <p className="text-lg">Humidity: <span className="font-semibold">{weather.main.humidity}%</span></p>
          <p className="text-lg">Wind Speed: <span className="font-semibold">{weather.wind.speed} m/s</span></p>
          <p className="text-lg">Sunrise: <span className="font-semibold">{formatTime(weather.sys.sunrise)}</span></p>
          <p className="text-lg">Sunset: <span className="font-semibold">{formatTime(weather.sys.sunset)}</span></p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mt-8 space-x-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleTemperatureUnit}
            className={`px-8 py-3 font-semibold rounded-lg shadow-lg transition ${darkMode ? "bg-blue-400 hover:bg-blue-600 text-white" : "bg-blue-400 hover:bg-blue-500 text-gray-900"}`}
          >
            Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  ) : (
    <p className="text-white text-center">No data found</p>
  );
}
