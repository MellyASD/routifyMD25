import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('log_entries')
export class LogEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  method: string;

  @Column({ length: 1024 })
  url: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'int', name: 'duration_ms' })
  durationMs: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  timestamp: Date;

  @Column({ type: 'int', nullable: true, name: 'user_id' })
  userId?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_email' })
  userEmail?: string | null;
}
