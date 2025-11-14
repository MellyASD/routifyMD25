import { IsEnum, IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { TransportType } from '../entities/transport.entity';
export class CreateTransportDTO {
  @IsEnum(TransportType)
  type: TransportType;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @Min(0)
  distance: number;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @Min(1)
  comfort: number;

  @IsNumber()
  @Min(1)
  reliability: number;

  @IsString()
  @IsOptional()
  notes?: string;
}