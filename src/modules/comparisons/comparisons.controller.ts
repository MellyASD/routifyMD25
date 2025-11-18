import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDTO } from 'src/dto/create-comparison.dto';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from '../auth/roles.decorator';

@Controller('comparisons')
@UseGuards(JwtAuthGuard)
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  async create(
    @Body() createComparisonDto: CreateComparisonDTO,
    @Request() req,
  ) {
    return await this.comparisonsService.create(
      createComparisonDto,
      req.user.id,
    );
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.comparisonsService.findAll();
  }

  @Get('my-comparisons')
  findMyComparisons(@Request() req) {
    return this.comparisonsService.findByUser(req.user.id);
  }
  
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.comparisonsService.findByUser(userId);
  }
  
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.comparisonsService.getStats();
  }

  @Get('my-stats')
  getMyStats(@Request() req) {
    return this.comparisonsService.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comparisonsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comparisonsService.remove(id);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComparisonDto: Partial<CreateComparisonDTO>,
    @Request() req,
  ) {
    return await this.comparisonsService.update(
      id,
      updateComparisonDto,
      req.user.id,
    );
  }
}
