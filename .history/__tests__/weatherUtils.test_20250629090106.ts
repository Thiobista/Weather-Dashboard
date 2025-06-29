import {
  convertTemperature,
  formatTime,
  formatDate,
  getWindDirection,
  getWeatherIcon,
  isDayTime,
  validateCityName,
  getTemperatureColor,
  getHumidityColor,
  getWindSpeedColor,
  capitalizeFirstLetter,
} from "../utils/weatherUtils";

describe("Weather Utils", () => {
  describe("convertTemperature", () => {
    it("should convert Celsius to Fahrenheit", () => {
      expect(convertTemperature(0, false)).toBe(32);
      expect(convertTemperature(100, false)).toBe(212);
      expect(convertTemperature(25, false)).toBe(77);
    });

    it("should return Celsius as is", () => {
      expect(convertTemperature(0, true)).toBe(0);
      expect(convertTemperature(100, true)).toBe(100);
      expect(convertTemperature(25, true)).toBe(25);
    });
  });

  describe("formatTime", () => {
    it("should format timestamp to readable time", () => {
      const timestamp = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const result = formatTime(timestamp);
      expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    });
  });

  describe("formatDate", () => {
    it("should format timestamp to readable date", () => {
      const timestamp = 1640995200; // Jan 1, 2022 00:00:00 UTC
      const result = formatDate(timestamp);
      expect(result).toContain("Saturday");
      expect(result).toContain("January");
      expect(result).toContain("2022");
    });
  });

  describe("getWindDirection", () => {
    it("should return correct wind direction for given degrees", () => {
      expect(getWindDirection(0)).toBe("N");
      expect(getWindDirection(45)).toBe("NE");
      expect(getWindDirection(90)).toBe("E");
      expect(getWindDirection(135)).toBe("SE");
      expect(getWindDirection(180)).toBe("S");
      expect(getWindDirection(225)).toBe("SW");
      expect(getWindDirection(270)).toBe("W");
      expect(getWindDirection(315)).toBe("NW");
    });

    it("should handle edge cases", () => {
      expect(getWindDirection(360)).toBe("N");
      expect(getWindDirection(720)).toBe("N");
    });
  });

  describe("getWeatherIcon", () => {
    it("should return correct weather icons", () => {
      expect(getWeatherIcon("Clear", true)).toBe("☀️");
      expect(getWeatherIcon("Clear", false)).toBe("🌙");
      expect(getWeatherIcon("Clouds")).toBe("☁️");
      expect(getWeatherIcon("Rain")).toBe("🌧️");
      expect(getWeatherIcon("Snow")).toBe("❄️");
      expect(getWeatherIcon("Thunderstorm")).toBe("⛈️");
    });

    it("should return default icon for unknown weather", () => {
      expect(getWeatherIcon("Unknown")).toBe("🌤️");
    });
  });

  describe("isDayTime", () => {
    it("should correctly determine if it's day time", () => {
      const now = Date.now() / 1000;
      const sunrise = now - 3600; // 1 hour ago
      const sunset = now + 3600; // 1 hour from now
      
      expect(isDayTime(sunrise, sunset)).toBe(true);
    });

    it("should correctly determine if it's night time", () => {
      const now = Date.now() / 1000;
      const sunrise = now + 3600; // 1 hour from now
      const sunset = now - 3600; // 1 hour ago
      
      expect(isDayTime(sunrise, sunset)).toBe(false);
    });
  });

  describe("validateCityName", () => {
    it("should validate correct city names", () => {
      expect(validateCityName("London")).toEqual({ isValid: true });
      expect(validateCityName("New York")).toEqual({ isValid: true });
      expect(validateCityName("Tokyo")).toEqual({ isValid: true });
      expect(validateCityName("São Paulo")).toEqual({ isValid: true });
    });

    it("should reject empty city names", () => {
      expect(validateCityName("")).toEqual({
        isValid: false,
        error: "Please enter a city name",
      });
      expect(validateCityName("   ")).toEqual({
        isValid: false,
        error: "Please enter a city name",
      });
    });

    it("should reject short city names", () => {
      expect(validateCityName("A")).toEqual({
        isValid: false,
        error: "City name must be at least 2 characters long",
      });
    });

    it("should reject city names with invalid characters", () => {
      expect(validateCityName("London123")).toEqual({
        isValid: false,
        error: "City name contains invalid characters",
      });
      expect(validateCityName("New@York")).toEqual({
        isValid: false,
        error: "City name contains invalid characters",
      });
    });
  });

  describe("getTemperatureColor", () => {
    it("should return correct colors for different temperatures", () => {
      expect(getTemperatureColor(-5, true)).toBe("text-blue-400");
      expect(getTemperatureColor(5, true)).toBe("text-blue-300");
      expect(getTemperatureColor(15, true)).toBe("text-green-400");
      expect(getTemperatureColor(25, true)).toBe("text-yellow-400");
      expect(getTemperatureColor(35, true)).toBe("text-red-400");
    });

    it("should handle Fahrenheit temperatures", () => {
      expect(getTemperatureColor(32, false)).toBe("text-blue-300"); // 0°C
      expect(getTemperatureColor(212, false)).toBe("text-red-400"); // 100°C
    });
  });

  describe("getHumidityColor", () => {
    it("should return correct colors for different humidity levels", () => {
      expect(getHumidityColor(20)).toBe("text-red-400");
      expect(getHumidityColor(45)).toBe("text-yellow-400");
      expect(getHumidityColor(70)).toBe("text-green-400");
    });
  });

  describe("getWindSpeedColor", () => {
    it("should return correct colors for different wind speeds", () => {
      expect(getWindSpeedColor(3)).toBe("text-green-400");
      expect(getWindSpeedColor(10)).toBe("text-yellow-400");
      expect(getWindSpeedColor(20)).toBe("text-red-400");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("WORLD")).toBe("World");
      expect(capitalizeFirstLetter("test")).toBe("Test");
    });

    it("should handle empty strings", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });
}); 