import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
// import * as path from 'path';

// MODIFICATION MADE: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string = uuidv4()) {
    this.name = name;
    this.id = id;
  }
}

// MODIFICATION MADE: Complete the HistoryService class
class HistoryService {
  private filePath = './db/searchHistory.json';

  // MODIFICATION MADE: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (error) {
      // If the file does not exist or is empty, return an empty array
      return [];
    }
  }

  // MODIFICATION MADE: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf8');
  }

  // MODIFICATION MADE: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  // MODIFICATION MADE: Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(cityName: string): Promise<City> {
    const cities = await this.getCities();
    const newCity = new City(cityName);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  public async deleteCity(id: string): Promise<void> {
    let cities = await this.getCities();
    cities = cities.filter(city => city.id !== id); // Filter out the city with the matching id
    await this.write(cities); // Save the updated list back to the file
  }
}

export default new HistoryService();
