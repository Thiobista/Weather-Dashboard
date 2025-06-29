"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Thermometer, Droplets, Wind } from "lucide-react";

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  pop: number; // Probability of precipitation
}

interface WeatherForecastProps {
  city: string;
  darkMode: boolean;
  isCelsius: boolean;
}

export default function WeatherForecast({ city, darkMode, isCelsius }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

  useEffect(() => {
    const fetchForecast = async () => {
      if (!city) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        
        const data = await response.json();
        
        // Group forecast by day and get daily forecast (every 24 hours)
        const dailyForecast = data.list.filter((_: { dt: number }, index: number) => index % 8 === 0).slice(0, 5);
        setForecast(dailyForecast);
      } catch (err) {
        setError("Unable to load forecast data");
        console.error("Forecast fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city]);

  const convertTemperature = (temp: number) => (isCelsius ? temp : (temp * 9) / 5 + 32);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = (weatherMain: string) => {
    const iconMap: Record<string, string> = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Snow: "❄️",
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Mist: "🌫️",
      Fog: "🌫️",
    };
    return iconMap[weatherMain] || "🌤️";
  };

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white/10"
        }`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading forecast...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 rounded-xl ${
          darkMode ? "bg-gray-800" : "bg-white/10"
        }`}
      >
        <p className="text-center text-red-400">{error}</p>
      </motion.div>
    );
  }

  if (forecast.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-6 rounded-xl ${
        darkMode ? "bg-gray-800" : "bg-white/10"
      }`}
    >
      <div className="flex items-center mb-6">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-xl font-semibold">5-Day Forecast</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg text-center ${
              darkMode ? "bg-gray-700" : "bg-white/5"
            }`}
          >
            <div className="text-sm font-medium mb-2">
              {formatDate(day.dt)}
            </div>
            
            <div className="text-3xl mb-2">
              {getWeatherIcon(day.weather[0].main)}
            </div>
            
            <div className="text-lg font-bold mb-1">
              {convertTemperature(day.main.temp).toFixed(1)}°{isCelsius ? "C" : "F"}
            </div>
            
            <div className="text-sm opacity-80 mb-3 capitalize">
              {day.weather[0].description}
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <Thermometer className="w-3 h-3" />
                <span>Feels: {convertTemperature(day.main.temp).toFixed(0)}°</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Droplets className="w-3 h-3" />
                <span>{day.main.humidity}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Wind className="w-3 h-3" />
                <span>{day.wind.speed} m/s {getWindDirection(day.wind.deg)}</span>
              </div>
              
              {day.pop > 0 && (
                <div className="text-blue-400">
                  {Math.round(day.pop * 100)}% rain
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 