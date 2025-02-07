export const fetchWeatherData = async (city: string) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    return response.json();
  };
  