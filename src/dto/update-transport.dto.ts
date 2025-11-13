import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransportDTO {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  speedKmH?: number;

  @IsOptional()
  @IsBoolean()
  isForDelivery?: boolean;
}
