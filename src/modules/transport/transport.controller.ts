import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDTO } from 'src/dto/create-transport.dto';
import { UpdateTransportDTO } from 'src/dto/update-transport.dto';

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
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  //  Update transport
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransportDTO) {
    return this.transportService.update(+id, dto);
  }

  // Delete transport
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(+id);
  }
}
