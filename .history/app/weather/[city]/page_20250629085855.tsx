"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWeather } from "@/store/weatherSlice";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, RefreshCw, Thermometer, Droplets, Wind, Clock, MapPin } from "lucide-react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number; deg: number };
  sys: { sunrise: number; sunset: number; country: string };
  visibility: number;
  dt: number;
}

export default function CityWeather() {
  const params = useParams();
  const router = useRouter();
  const city = Array.isArray(params.city) ? params.city[0] : params.city;
  const dispatch = useAppDispatch();
  const { weather, loading, error } = useAppSelector(
    (state) => state.weather as { weather: WeatherData | null; loading: boolean; error: string | null }
  );

  const [isCelsius, setIsCelsius] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (city) {
      dispatch(fetchWeather(decodeURIComponent(city)));
    }
  }, [city, dispatch]);

  const toggleTemperatureUnit = () => setIsCelsius((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleRefresh = async () => {
    if (!city) return;
    setIsRefreshing(true);
    await dispatch(fetchWeather(decodeURIComponent(city)));
    setIsRefreshing(false);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const convertTemperature = (temp: number) => (isCelsius ? temp : (temp * 9) / 5 + 32);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWeatherIcon = (weatherMain: string, isDay: boolean) => {
    const iconMap: Record<string, string> = {
      Clear: isDay ? "☀️" : "🌙",
      Clouds: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Mist: "🌫️",
      Fog: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Dust: "🌫️",
      Sand: "🌫️",
      Ash: "🌫️",
      Squall: "💨",
      Tornado: "🌪️",
    };
    return iconMap[weatherMain] || "🌤️";
  };

  const isDayTime = () => {
    if (!weather) return true;
    const now = Date.now() / 1000;
    return now >= weather.sys.sunrise && now <= weather.sys.sunset;
  };

  if (loading && !weather) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-600 to-indigo-900"
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading weather data...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-600 to-indigo-900"
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-8 rounded-2xl max-w-md mx-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>Error Loading Weather</h2>
          <p className={`mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              Go Back
            </button>
            <button
              onClick={handleRefresh}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <RefreshCw className="inline w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return weather ? (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200" 
          : "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white"
      }`}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            darkMode 
              ? "bg-gray-800 hover:bg-gray-700 text-white" 
              : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          }`}
          aria-label="Go back to search"
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-white" 
                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            } ${isRefreshing ? "opacity-50" : ""}`}
            aria-label="Refresh weather data"
          >
            <RefreshCw size={24} className={isRefreshing ? "animate-spin" : ""} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative p-6 sm:p-8 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto border ${
            darkMode 
              ? "bg-gray-800/90 text-white border-gray-700" 
              : "bg-white/10 text-white border-white/20 backdrop-blur-md"
          }`}
        >
          {/* City Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <h1 className="text-3xl sm:text-4xl font-bold">{weather.name}</h1>
              <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                darkMode ? "bg-gray-700" : "bg-white/20"
              }`}>
                {weather.sys.country}
              </span>
            </div>
            <p className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-200"
            }`}>
              {formatDate(weather.dt)}
            </p>
          </div>

          {/* Weather Icon and Description */}
          <div className="flex flex-col items-center mb-8">
            <div className="text-8xl mb-4">
              {getWeatherIcon(weather.weather[0].main, isDayTime())}
            </div>
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={`${weather.weather[0].description} weather icon`}
              width={80}
              height={80}
              className="mb-2"
            />
            <p className="text-xl font-medium capitalize">{weather.weather[0].description}</p>
          </div>

          {/* Temperature Display */}
          <div className="text-center mb-8">
            <motion.div
              key={isCelsius ? "Celsius" : "Fahrenheit"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-6xl sm:text-7xl font-bold mb-2"
            >
              {convertTemperature(weather.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}
            </motion.div>
            <p className="text-lg opacity-80">
              Feels like {convertTemperature(weather.main.feels_like).toFixed(1)}°{isCelsius ? "C" : "F"}
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-sm">
              <span>Min: {convertTemperature(weather.main.temp_min).toFixed(1)}°</span>
              <span>Max: {convertTemperature(weather.main.temp_max).toFixed(1)}°</span>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-4 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-white/10"
              }`}
            >
              <div className="flex items-center mb-2">
                <Thermometer className="w-5 h-5 mr-2" />
                <span className="font-semibold">Temperature</span>
              </div>
              <p className="text-2xl font-bold">{convertTemperature(weather.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-white/10"
              }`}
            >
              <div className="flex items-center mb-2">
                <Droplets className="w-5 h-5 mr-2" />
                <span className="font-semibold">Humidity</span>
              </div>
              <p className="text-2xl font-bold">{weather.main.humidity}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-4 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-white/10"
              }`}
            >
              <div className="flex items-center mb-2">
                <Wind className="w-5 h-5 mr-2" />
                <span className="font-semibold">Wind</span>
              </div>
              <p className="text-2xl font-bold">{weather.wind.speed} m/s</p>
              <p className="text-sm opacity-80">{getWindDirection(weather.wind.deg)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-4 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-white/10"
              }`}
            >
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">Pressure</span>
              </div>
              <p className="text-2xl font-bold">{weather.main.pressure} hPa</p>
            </motion.div>
          </div>

          {/* Sunrise/Sunset */}
          <div className={`p-4 rounded-xl mb-8 ${
            darkMode ? "bg-gray-700" : "bg-white/10"
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-center">Sun Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🌅</div>
                <p className="font-semibold">Sunrise</p>
                <p className="text-lg">{formatTime(weather.sys.sunrise)}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌇</div>
                <p className="font-semibold">Sunset</p>
                <p className="text-lg">{formatTime(weather.sys.sunset)}</p>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTemperatureUnit}
              className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              }`}
            >
              Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  ) : (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-600 to-indigo-900"
    }`}>
      <p className="text-white text-center">No weather data available</p>
    </div>
  );
}