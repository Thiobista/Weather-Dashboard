import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
}

interface WeatherState {
  weatherCache: Record<string, WeatherData>; // Cache for previously searched cities
  weather: WeatherData | null;
  loading: boolean;
  error: string;
}

// Initial state
const initialState: WeatherState = {
  weatherCache: {},
  weather: null,
  loading: false,
  error: "",
};

// Thunk to fetch weather data from OpenWeather API with caching
export const fetchWeather = createAsyncThunk<
  WeatherData,
  string,
  { rejectValue: string; state: { weather: WeatherState } }
>("weather/fetchWeather", async (city, { rejectWithValue, getState }) => {
  if (!city.trim()) {
    return rejectWithValue("Invalid city name is entered.");
  }

  // Check if the city is already in the cache
  const { weatherCache } = getState().weather;
  if (weatherCache[city]) {
    return weatherCache[city]; // Return cached data
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return rejectWithValue("Invalid city name is entered.");
      } else {
        return rejectWithValue("Unable to fetch weather data. Please try again.");
      }
    }

    const data: WeatherData = await response.json();
    return data;
  } catch {
    return rejectWithValue("Unable to fetch weather data. Please try again.");
  }
});

// Redux slice to handle weather data, caching, loading state, and errors
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = ""; // Reset error when fetching new data
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.weather = action.payload;
        state.weatherCache[action.payload.name] = action.payload; // Cache the data
        state.loading = false;
        state.error = ""; // Clear error on success
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.weather = null; // Reset weather data on error
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;