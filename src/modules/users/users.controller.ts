import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('serch/:name')
  @Roles(UserRole.ADMIN)
  async searchByName(@Param('name') name: string): Promise<User[]> {
    return this.usersService.findByName(name);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return this.usersService.update(id, body);
  }

  @Patch(':id/disable')
  @Roles(UserRole.ADMIN)
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.disable(id);
  }
}
