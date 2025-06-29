import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWeather } from "@/store/weatherSlice";

interface UseWeatherReturn {
  weather: any;
  loading: boolean;
  error: string | null;
  isCelsius: boolean;
  darkMode: boolean;
  toggleTemperatureUnit: () => void;
  toggleDarkMode: () => void;
  refreshWeather: (city: string) => Promise<void>;
  validateCity: (cityName: string) => Promise<boolean>;
}

export const useWeather = (): UseWeatherReturn => {
  const dispatch = useAppDispatch();
  const { weather, loading, error } = useAppSelector(
    (state) => state.weather as { weather: any; loading: boolean; error: string | null }
  );

  const [isCelsius, setIsCelsius] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTemperatureUnit = useCallback(() => {
    setIsCelsius((prev) => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const refreshWeather = useCallback(async (city: string) => {
    if (!city) return;
    await dispatch(fetchWeather(city));
  }, [dispatch]);

  const validateCity = useCallback(async (cityName: string): Promise<boolean> => {
    if (!cityName.trim()) {
      return false;
    }

    if (cityName.length < 2) {
      return false;
    }

    try {
      const API_KEY = "26373a759031315dc0b7b714bc0f31fe";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Persist theme preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return {
    weather,
    loading,
    error,
    isCelsius,
    darkMode,
    toggleTemperatureUnit,
    toggleDarkMode,
    refreshWeather,
    validateCity,
  };
}; 