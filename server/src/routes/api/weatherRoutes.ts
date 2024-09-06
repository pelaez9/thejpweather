import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data

router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    // If cityName is not provided, return a 400 status with an error message
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Return the weather data and saved city as the response
    return res.json (weatherData);
  } catch (error) {
    console.log("post /api/weather: ",error);
    
    // Handle any errors by returning a 500 status with an error message
    return res.status(500).json({ message: 'Failed to retrieve weather data or save city to history', error });
  }
});

// GET search history
router.get('/history', async (_: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.log("get /api/weather/history: ",error)
    res.status(500).json({ message: 'Failed to retrieve weather history', error });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.deleteCity(id);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.log("delete /api/weather/history: ",error)
    res.status(500).json({ message: 'Failed to delete city', error });
  }
});

export default router;
