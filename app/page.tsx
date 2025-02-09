"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

export default function HomePage() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const searchCity = selectedCity.trim() !== "" ? selectedCity : city.trim();

    if (searchCity === "") {
      alert("Invalid city name is entered.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        alert("Invalid city name is entered.");
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
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-6xl font-bold mb-8 text-center tracking-wide uppercase shadow-lg">
        Weather Dashboard
      </h1>

      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md relative z-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Find the Current Weather</h2>

        <div className="relative flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-4 rounded-lg border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out text-black w-full"
          />

          <button
            onClick={handleSearch}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-auto animate-fadeIn">
            <ul className="divide-y divide-gray-200">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCity(suggestion);
                    setSelectedCity(suggestion);
                    setSuggestions([]);
                  }}
                  className="p-4 cursor-pointer transition-all duration-200 ease-in-out hover:bg-teal-100 hover:text-teal-700 text-black flex items-center justify-between rounded-lg transform hover:scale-105"
                >
                  <span className="font-medium">{suggestion}</span>
                  <span className="text-sm text-gray-500">🌍 City</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-gray-300 text-sm">
        <p>&copy; 2025 Weather Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
