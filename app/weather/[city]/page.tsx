"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWeather } from "@/store/weatherSlice";
import Image from "next/image";

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

  useEffect(() => {
    if (city) dispatch(fetchWeather(city));
  }, [city, dispatch]);

  if (loading) return <p className="text-white text-xl">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return weather ? (
    <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-xl max-w-md mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-4">{weather.name}</h1>
      <div className="flex flex-col items-center">
        <Image
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt="Weather Icon"
          width={120}
          height={120}
        />
        <p className="text-xl mt-4">{weather.weather[0].description}</p>
        <div className="mt-6 space-y-2">
          <p className="text-lg">Temperature: <span className="font-semibold">{weather.main.temp}°C</span></p>
          <p className="text-lg">Humidity: <span className="font-semibold">{weather.main.humidity}%</span></p>
          <p className="text-lg">Wind Speed: <span className="font-semibold">{weather.wind.speed} m/s</span></p>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-white">No data found</p>
  );
}
