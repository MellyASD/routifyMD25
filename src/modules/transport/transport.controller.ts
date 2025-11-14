import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDTO } from 'src/dto/create-transport.dto';
import { UpdateTransportDTO } from 'src/dto/update-transport.dto';
import { Roles } from 'src/modules/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  //  Create a new transport
  @Post()
  create(@Body() dto: CreateTransportDTO) {
    return this.transportService.create(dto);
  }

  //  Get all transports
  @Get()
  findAll() {
    return this.transportService.findAll();
  }

  //  Get one transport by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transportService.findOne(id);
  }

  //  Update transport
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransportDTO,
  ) {
    return this.transportService.update(id, dto);
  }

  // Delete transport
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transportService.remove(id);
  }
}
