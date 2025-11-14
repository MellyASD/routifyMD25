import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDTO } from 'src/dto/create-transport.dto';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompareTransportDTO } from 'src/dto/compare-transport.dto';
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRUCKER)
  create(@Body() createTransportDto: CreateTransportDTO) {
    return this.transportService.create(createTransportDto);
  }

  @Get()
  findAll() {
    return this.transportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(id);
  }

  @Post('compare')
  compare(@Body() compareDto: CompareTransportDTO) {
    return this.transportService.compareTransports(
      compareDto.origin,
      compareDto.destination,
    );
  }
}