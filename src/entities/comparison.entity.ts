import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Transport } from "./transport.entity";


@Entity('comparisons')
export class Comparison {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('simple-json')
  results: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transport, transport => transport.comparison)
  transports: Transport[];

}