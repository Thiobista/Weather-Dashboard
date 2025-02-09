Weather Dashboard

A weather dashboard built with Next.js and Redux Toolkit that consumes the OpenWeather API to fetch and display weather data for a searched city. This application allows users to search for a city and view detailed weather information such as temperature, humidity, weather description, wind speed, and more.



Features

Search for Cities: Users can search for cities and view their respective weather data.
City Weather Page: Displays detailed weather information for the selected city.
State Management: Manages weather data, loading state, and errors using Redux Toolkit.
Temperature Toggle: Users can switch between Celsius and Fahrenheit units.
Responsive Design: The app is fully responsive, providing a user-friendly experience on all devices.
Error Handling: Proper error handling for invalid city names and API failures.

Live Demo

https://weather-dashboard-i65sbhp3q-thiobista-gedefaws-projects.vercel.app/


Installation

Prerequisites
Node.js (v14 or higher)
Yarn or npm (depending on your preference)


Steps to Run Locally
Clone the repository:
git clone https://github.com/your-username/weather-dashboard.git
Navigate to the project folder:
cd weather-dashboard
Install dependencies:

Using npm:
npm install
Or using Yarn:
yarn install
Add your OpenWeather API key:

Create an .env.local file in the root of the project and add your API key:
NEXT_PUBLIC_OPENWEATHER_API_KEY=your-api-key-here
You can get a free API key by registering on OpenWeather.

Start the development server:

Using npm:
npm run dev
Or using Yarn:
yarn dev
Visit the app:

Open your browser and go to http://localhost:3000.

How the App Works
Homepage (/):

A search bar where users can input a city name.
A “Search” button to trigger the weather data fetching for the entered city.
City Weather Page (/weather/[city]):

After the user searches for a city, they are redirected to the /weather/[city] page that displays:
Current temperature
Humidity level
Weather description (e.g., clear sky)
Wind speed
Weather icon

State Management with Redux Toolkit:

weather: Stores the fetched weather data.
loading: Tracks if the app is fetching weather data.
error: Captures any errors during the API request.
Temperature Toggle:

Users can toggle between Celsius and Fahrenheit units using a button.
API Integration:

The app uses the OpenWeather API (https://api.openweathermap.org/data/2.5/weather) to fetch the weather data.
Example API request:
https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric



Project Structure
/pages
  /index.tsx              # Homepage (search bar and city search logic)
  /weather/[city].tsx     # City weather details page
/store
  /weatherSlice.ts        # Redux slice for weather data and state management
/components
  /WeatherCard.tsx        # Weather card component displaying weather data
  /SearchBar.tsx          # Search bar component for city input
/utils
  /api.ts                 # Utility for API calls to OpenWeather
/styles
  /globals.css            # Global styles for the app
  /tailwind.config.js     # Tailwind CSS configuration


Error Handling
If the user enters an invalid city name or the API request fails, an error message is displayed.
The app also provides loading indicators while fetching data from the API.


Redux Integration
Redux Toolkit is used for state management, handling the following:

weather: Holds the fetched weather data.
loading: Tracks if the data is being fetched.
error: Captures any errors from the API or user input.


Technologies Used
Next.js: React framework for building the app.
Redux Toolkit: For managing state globally.
Tailwind CSS: For styling the app and making it responsive.
TypeScript: For type safety and improving code quality.
OpenWeather API: For fetching weather data.


Bonus Features
Caching: Previously searched cities are cached in Redux to avoid repeated API calls for the same city.
Loading Indicators: Added loading indicators when data is being fetched from the API.
Unit Toggle: Users can toggle between Celsius and Fahrenheit.


Contributing
If you'd like to contribute to this project, feel free to fork the repository and create a pull request. Please make sure to follow the coding standards and write tests for new features.


License
This project is open source and available under the MIT License.

