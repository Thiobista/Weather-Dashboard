export const convertTemperature = (temp: number, isCelsius: boolean): number => {
  return isCelsius ? temp : (temp * 9) / 5 + 32;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatShortDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const getWeatherIcon = (weatherMain: string, isDay: boolean = true): string => {
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

export const isDayTime = (sunrise: number, sunset: number): boolean => {
  const now = Date.now() / 1000;
  return now >= sunrise && now <= sunset;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateCityName = (cityName: string): { isValid: boolean; error?: string } => {
  if (!cityName.trim()) {
    return { isValid: false, error: "Please enter a city name" };
  }

  if (cityName.length < 2) {
    return { isValid: false, error: "City name must be at least 2 characters long" };
  }

  if (!/^[a-zA-Z\s\-']+$/.test(cityName)) {
    return { isValid: false, error: "City name contains invalid characters" };
  }

  return { isValid: true };
};

export const getTemperatureColor = (temp: number, isCelsius: boolean): string => {
  const tempInCelsius = isCelsius ? temp : (temp - 32) * 5 / 9;
  
  if (tempInCelsius < 0) return "text-blue-400";
  if (tempInCelsius < 10) return "text-blue-300";
  if (tempInCelsius < 20) return "text-green-400";
  if (tempInCelsius < 30) return "text-yellow-400";
  return "text-red-400";
};

export const getHumidityColor = (humidity: number): string => {
  if (humidity < 30) return "text-red-400";
  if (humidity < 60) return "text-yellow-400";
  return "text-green-400";
};

export const getWindSpeedColor = (speed: number): string => {
  if (speed < 5) return "text-green-400";
  if (speed < 15) return "text-yellow-400";
  return "text-red-400";
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

export const formatVisibility = (visibility: number): string => {
  return `${(visibility / 1000).toFixed(1)} km`;
}; 