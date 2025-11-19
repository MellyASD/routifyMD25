import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { LogsService } from './logs.service';
import { APP_FILTER } from '@nestjs/core';
import { User } from 'src/entities/user.entity';
import { AllExceptionsFilter } from 'src/common/filters/http-exception.filter';
import { LoggingDbInterceptor } from './interceptors/logging-db.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntry, User])],
  providers: [
    LogsService,
    LoggingDbInterceptor,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LogsService, LoggingDbInterceptor],
})
export class LogsModule {}
