import { Body, Controller, Post } from '@nestjs/common';
import { WeatherPayloadDto } from './dtos/weather.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('/')
  async weather(@Body() weatherPayload: WeatherPayloadDto) {
    // Transfer later data in params and make it get type
    const weatherResponse = await this.weatherService.findWeather(
      weatherPayload.lat,
      weatherPayload.lon,
    );
    return weatherResponse;
  }
}
