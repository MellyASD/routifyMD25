import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from 'src/entities/transport.entity';
import { TransportSimulatorService } from '../services/transport-simulator.service';
import { Comparison } from 'src/entities/comparison.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transport,Comparison])],
  controllers: [TransportController],
  providers: [TransportService, TransportSimulatorService],
  exports: [TransportService],
})
export class TransportModule {}
