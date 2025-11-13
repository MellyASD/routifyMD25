import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class UpdateUserDTO {

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(6, 10, { message: 'The password must be between 6 and 10 characters long' })
  password?: string;

  @IsOptional()
  role: UserRole

}
