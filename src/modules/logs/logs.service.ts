import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntry } from 'src/entities/log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogEntry)
    private readonly repo: Repository<LogEntry>,
  ) {}

  async saveLog(data: Partial<LogEntry>) {
    const ent = this.repo.create({
      method: data.method,
      url: data.url,
      status: data.status,
      durationMs: data.durationMs,
      timestamp: data.timestamp ?? new Date(),
      userId: data.userId ?? null,
      userEmail: data.userEmail ?? null,
    });
    return this.repo.save(ent);
  }
}
