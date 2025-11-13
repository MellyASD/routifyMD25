import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTransportDTO {
  @IsString()
  type: string; // name of transport

  @IsNumber()
  speedKmH: number; // speed in km/h

  @IsBoolean()
  isForDelivery: boolean; // used for delivery or not
}
