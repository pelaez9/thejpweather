import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// MODIFICATION MADE: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// MODIFICATION MADE: Define a class for the Weather object
// city, date, icon, iconDescription, tempF, windSpeed, humidity
class Weather {
  constructor(
    public city: string,
    public date: string,
    public tempF: number,
    public humidity: number,
    public windSpeed: number,
    public iconDescription: string,
    public icon: string
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// MODIFICATION MADE: Complete the WeatherService class
class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey = process.env.OPENWEATHER_API_KEY || '';
  private cityName: string = '';

  // MODIFICATION MADE: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await axios.get(this.buildGeocodeQuery(query));
    const locationData = response.data[0];
    return this.destructureLocationData(locationData);
  }

  // MODIFICATION MADE: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // MODIFICATION MADE: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // MODIFICATION MADE: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // MODIFICATION MADE: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    return await this.fetchLocationData(this.cityName);
  }

  // MODIFICATION MADE: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await axios.get(this.buildWeatherQuery(coordinates));
    return response.data;
  }

  // MODIFICATION MADE: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const currentWeather = response.list[0]; // Assuming the first entry is the current weather
    return new Weather(
      this.cityName,
      currentWeather.dt_txt,
      currentWeather.main.temp,
      currentWeather.main.humidity,
      currentWeather.wind.speed,
      currentWeather.weather[0].description,
      currentWeather.weather[0].icon
    );
  }

  // MODIFICATION MADE: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data) => new Weather(
      this.cityName,
      data.dt_txt,
      data.main.temp,
      data.main.humidity,
      data.wind.speed,
      data.weather[0].description,
      data.weather[0].icon
    ));
  }

  // MODIFICATION MADE: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise< Weather[] > {
    this.cityName = city;
    
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list.slice(1, 6)); // Example: Next 5 entries as the forecast
    return forecast;
  }
}

export default new WeatherService();
