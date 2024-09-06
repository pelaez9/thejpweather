import HistoryService from './service/historyService';
import WeatherService from './service/weatherService';

async function testHistoryService() {
  console.log('Testing HistoryService...');
  
  // Add a city
  const city = await HistoryService.addCity('New York');
  console.log('City added:', city);

  // Get all cities
  const cities = await HistoryService.getCities();
  console.log('Cities retrieved:', cities);

  // Remove the city
  await HistoryService.deleteCity(city.id);
  console.log('City removed:', city.id);
  
  console.log('HistoryService tests completed.');
}

async function testWeatherService() {
  console.log('Testing WeatherService...');

  // Get weather for a city
  const weatherData = await WeatherService.getWeatherForCity('New York');
  console.log('Weather data retrieved:', weatherData);

  console.log('WeatherService tests completed.');
}

async function runTests() {
  await testHistoryService();
  await testWeatherService();
}

runTests();

