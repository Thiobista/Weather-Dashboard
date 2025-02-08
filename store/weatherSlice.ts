import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

// Thunk to fetch weather data from OpenWeather API
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city: string, { rejectWithValue }) => {
    if (!city.trim()) {
      return rejectWithValue("Invalid city name is entered.");
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

      return await response.json();
    } catch {
      return rejectWithValue("Unable to fetch weather data. Please try again.");
    }
  }
);

// Redux slice to handle weather data, loading state, and errors
const weatherSlice = createSlice({
  name: "weather",
  initialState: { weather: null, loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = ""; // Reset error when fetching new data
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
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
