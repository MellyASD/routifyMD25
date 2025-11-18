import { IsNotEmpty, IsString } from "class-validator";

export class CreateComparisonDTO {

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}
