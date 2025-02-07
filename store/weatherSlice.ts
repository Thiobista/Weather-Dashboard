import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "26373a759031315dc0b7b714bc0f31fe";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    return response.json();
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: { weather: null, loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.weather = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch weather";
      });
  },
});

export default weatherSlice.reducer;
