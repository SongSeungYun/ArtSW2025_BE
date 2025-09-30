// Path: src/tutorials/entities/tutorial.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm'; // Added Index
import { Method } from './method.entity';
import { BlankAnswer } from './blank-answer.entity';

@Entity('tutorials', { schema: 'prompting' })
export class Tutorial {
  @PrimaryGeneratedColumn()
  tutorial_id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Index(['method_id']) // Added Index
  @ManyToOne(() => Method, method => method.tutorials)
  @JoinColumn({ name: 'method_id' })
  method: Method;

  @OneToMany(() => BlankAnswer, (blankAnswer) => blankAnswer.tutorial)
  blankAnswers: BlankAnswer[];
}