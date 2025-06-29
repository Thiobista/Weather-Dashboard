"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, AlertCircle, Loader2 } from "lucide-react";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}

export default function HomePage() {
  const [city, setCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Popular cities for quick access
  const popularCities = [
    { name: "New York", country: "US" },
    { name: "London", country: "GB" },
    { name: "Tokyo", country: "JP" },
    { name: "Paris", country: "FR" },
    { name: "Sydney", country: "AU" },
    { name: "Mumbai", country: "IN" },
  ];

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateCity = async (cityName: string): Promise<boolean> => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return false;
    }

    if (cityName.length < 2) {
      setError("City name must be at least 2 characters long");
      return false;
    }

    setIsValidating(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        setError("City not found. Please check the spelling and try again.");
        return false;
      }
      
      return true;
    } catch {
      setError("Network error. Please check your connection and try again.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSearch = async () => {
    const searchCity = selectedCity.trim() !== "" ? selectedCity : city.trim();
    
    const isValid = await validateCity(searchCity);
    if (!isValid) return;

    setLoading(true);
    setError("");
    
    try {
      router.push(`/weather/${encodeURIComponent(searchCity)}`);
    } catch {
      setError("Navigation error. Please try again.");
      setLoading(false);
    }
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    setSelectedCity(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
    inputRef.current?.focus();
  };

  const handleQuickCity = (cityName: string) => {
    router.push(`/weather/${encodeURIComponent(cityName)}`);
  };

  // Debounced city suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (city.trim().length >= 2) {
        fetchCitySuggestions(city);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [city]);

  const fetchCitySuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&units=metric&type=like&sort=population&cnt=5`
      );
      const data = await response.json();
      
      if (data.list) {
        const formattedSuggestions = data.list.map((city: { name: string; sys: { country: string }; state?: string }) => ({
          name: city.name,
          country: city.sys.country,
          state: city.state || undefined,
        }));
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      }
    } catch {
      console.error("Error fetching city suggestions");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          darkMode 
            ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" 
            : "bg-white hover:bg-gray-100 text-gray-700 shadow-xl"
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </motion.button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Weather Dashboard
          </h1>
          <p className={`text-lg sm:text-xl opacity-80 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Get real-time weather information for any city worldwide
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm border ${
            darkMode 
              ? "bg-gray-800/80 border-gray-700" 
              : "bg-white/80 border-gray-200"
          }`}
        >
          <h2 className={`text-2xl font-semibold mb-6 text-center ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}>
            Find Current Weather
          </h2>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter city name (e.g., London, Tokyo, New York)"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setSelectedCity("");
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 text-lg focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                aria-describedby={error ? "error-message" : undefined}
              />
              {isValidating && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center text-red-500 text-sm"
                  id="error-message"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* City Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute left-0 right-0 mt-2 border-2 rounded-xl shadow-2xl max-h-60 overflow-auto z-20 ${
                    darkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={`${suggestion.name}-${suggestion.country}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleCitySelect(suggestion.name)}
                      className={`w-full p-4 text-left transition-all duration-200 hover:scale-[1.02] flex items-center justify-between ${
                        darkMode 
                          ? "hover:bg-gray-700 border-b border-gray-700 last:border-b-0" 
                          : "hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      }`}
                    >
                      <div className="flex items-center">
                        <MapPin className={`w-4 h-4 mr-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`} />
                        <div>
                          <span className="font-medium">{suggestion.name}</span>
                          {suggestion.state && (
                            <span className={`ml-2 text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {suggestion.state}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        darkMode 
                          ? "bg-gray-700 text-gray-300" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {suggestion.country}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={loading || isValidating}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              loading || isValidating
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg"
            } ${
              darkMode 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </div>
            ) : (
              "Get Weather"
            )}
          </motion.button>
        </motion.div>

        {/* Popular Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <h3 className={`text-xl font-semibold mb-4 text-center ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Popular Cities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularCities.map((cityData, index) => (
              <motion.button
                key={cityData.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickCity(cityData.name)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white hover:bg-gray-50 border border-gray-200 shadow-md"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-sm font-medium">{cityData.name}</div>
                <div className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {cityData.country}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className={`text-sm opacity-70 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            © 2025 Weather Dashboard. Built with Next.js & OpenWeatherMap API
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}