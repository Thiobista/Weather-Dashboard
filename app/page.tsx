"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

export default function HomePage() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const searchCity = selectedCity.trim() !== "" ? selectedCity : city.trim();
    if (searchCity === "") {
      alert("Invalid city name entered.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        alert("Invalid city name entered.");
        setLoading(false);
        return;
      }
      router.push(`/weather/${searchCity}`);
    } catch {
      alert("Error fetching weather data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city.trim() === "") {
      setSuggestions([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/find?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.list) {
          setSuggestions(data.list.map((city: { name: string }) => city.name));
        }
      } catch {
        console.error("Error fetching city data");
      }
    };
    fetchCities();
  }, [city]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 p-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-5xl font-extrabold mb-8 tracking-wide">Weather Dashboard</h1>

      <div className={`rounded-lg p-6 shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2
          className={`text-2xl font-semibold mb-4 text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Find the Current Weather
        </h2>

        <div className="relative flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`p-4 rounded-lg border shadow-lg focus:outline-none focus:ring-2 w-full transition-all duration-300 text-black ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white focus:ring-gray-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          <button
            onClick={handleSearch}
            className={`font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div
            className={`absolute w-full max-w-md border rounded-lg shadow-lg mt-2 max-h-60 overflow-auto animate-fadeIn ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            } z-10`}
          >
            <ul className="divide-y">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCity(suggestion);
                    setSelectedCity(suggestion);
                    setSuggestions([]);
                  }}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg flex items-center justify-between ${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-indigo-100"
                  }`}
                >
                  <span className="font-medium">{suggestion}</span>
                  <span className="text-sm">🌍 City</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-sm opacity-80">
        <p>&copy; 2025 Weather Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
