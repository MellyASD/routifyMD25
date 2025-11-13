import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { LogsService } from './logs.service';
import { LoggingDbInterceptor } from './interceptors/logging-db.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntry])],
  providers: [LogsService, LoggingDbInterceptor],
  exports: [LogsService, LoggingDbInterceptor],
})
export class LogsModule {}
