// Path: src/tutorials/entities/tutorial.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Method } from './method.entity';

@Entity('tutorial', { schema: 'prompting' })
export class Tutorial {
  @PrimaryGeneratedColumn()
  tutorial_id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Method, method => method.tutorials)
  @JoinColumn({ name: 'method_id' })
  method: Method;
}