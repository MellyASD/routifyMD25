import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transport')
export class Transport {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the transport

  @Column({ type: 'varchar', length: 100 })
  type: string; // Transport type name (e.g., "Car", "Bus", "Motorcycle")

  @Column({ type: 'float' })
  speedKmH: number; // Average speed in kilometers per hour

  @Column({ type: 'boolean', default: false })
  isForDelivery: boolean; // True if used for deliveries or shipping
}
