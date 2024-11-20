import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}
  async findWeather(lat: number, lon: number) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    const parsedRes = await res.json();
    return parsedRes;
  }
}
