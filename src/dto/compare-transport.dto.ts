import { IsNotEmpty, IsString } from "class-validator";


export class CompareTransportDTO {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}