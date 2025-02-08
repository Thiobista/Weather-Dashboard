"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWeather } from "@/store/weatherSlice";
import Image from "next/image";
import { motion } from "framer-motion";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

export default function CityWeather() {
  const params = useParams();
  const city = Array.isArray(params.city) ? params.city[0] : params.city;
  const dispatch = useAppDispatch();
  const { weather, loading, error } = useAppSelector(
    (state) => state.weather as { weather: WeatherData | null; loading: boolean; error: string | null }
  );

  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    if (city) dispatch(fetchWeather(city));
  }, [city, dispatch]);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  const convertTemperature = (temp: number) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };

  if (loading) return <p className="text-white text-xl text-center mt-10">Loading...</p>;

  if (error) {
    return <p className="text-red-500 text-xl text-center mt-10">{error}</p>;
  }

  return weather ? (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl max-w-md mx-auto text-white border border-white/20"
      >
        {/* City Name */}
        <h1 className="text-4xl font-extrabold text-center drop-shadow-md">{weather.name}</h1>

        {/* Weather Icon */}
        <div className="flex flex-col items-center mt-4">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            width={100}
            height={100}
            className="drop-shadow-lg"
          />
          <p className="text-lg font-medium capitalize mt-2">{weather.weather[0].description}</p>
        </div>

        {/* Weather Details */}
        <div className="mt-6 space-y-3 text-center">
          <motion.p
            key={isCelsius ? "Celsius" : "Fahrenheit"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-semibold"
          >
            {convertTemperature(weather.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}
          </motion.p>
          <p className="text-lg">Humidity: <span className="font-semibold">{weather.main.humidity}%</span></p>
          <p className="text-lg">Wind Speed: <span className="font-semibold">{weather.wind.speed} m/s</span></p>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleTemperatureUnit}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
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
