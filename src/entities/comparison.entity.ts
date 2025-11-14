import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('comparisons')
export class Comparison {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}