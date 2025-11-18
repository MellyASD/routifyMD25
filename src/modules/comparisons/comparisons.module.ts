import { forwardRef, Module } from '@nestjs/common';
import { ComparisonsController } from './comparisons.controller';
import { ComparisonsService } from './comparisons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comparison } from 'src/entities/comparison.entity';
import { User } from 'src/entities/user.entity';
import { TransportModule } from '../transport/transport.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comparison, User]), forwardRef(() => TransportModule)],
  controllers: [ComparisonsController],
  providers: [ComparisonsService],
  exports: [ComparisonsService],
})
export class ComparisonsModule {}
