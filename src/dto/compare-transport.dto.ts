import { IsNotEmpty, IsString } from "class-validator";


export class CompareTransportDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}