import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateRouteDTO } from 'src/dto/create-route.dto';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompareTransportDTO } from 'src/dto/compare-transport.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('route')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRUCKER)
  create(@Body() createRouteDto: CreateRouteDTO) {
    return this.transportService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.transportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
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