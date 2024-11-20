import { IsNotEmpty, IsNumber } from 'class-validator';

export class WeatherPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lon: number;
}
