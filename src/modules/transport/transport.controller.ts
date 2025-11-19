import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import { Roles } from '../auth/roles.decorator';
import { CompareTransportDTO } from 'src/dto/compare-transport.dto';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateRouteDTO } from 'src/dto/create-route.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transport')
@ApiBearerAuth()
@Controller('/api/transport')
@UseGuards(JwtAuthGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('route')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRUCKER)
  @ApiOperation({ summary: 'Create a new transport route' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createRouteDto: CreateRouteDTO) {
    return this.transportService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transport routes' })
  @ApiResponse({ status: 200, description: 'List of all transport routes' })
  findAll() {
    return this.transportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transport route by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Transport route found' })
  @ApiResponse({ status: 404, description: 'Transport route not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transportService.findOne(id);
  }

  @Post('compare')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Compare transport options between two locations' })
  @ApiResponse({ status: 201, description: 'Comparison result returned' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  compare(@Body() compareDto: CompareTransportDTO) {
    return this.transportService.compareTransports(
      compareDto.origin,
      compareDto.destination,
    );
  }
}
