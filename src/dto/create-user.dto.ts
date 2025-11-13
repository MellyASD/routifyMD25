import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class CreateUserDTO {
  
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 10, { message: 'The password must be between 6 and 10 characters long'})
  password: string;
  
  @IsString()
  @IsOptional()
  role?: UserRole;

}