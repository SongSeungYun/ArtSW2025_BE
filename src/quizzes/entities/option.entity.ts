import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity('OptionTable')
export class Option {
  @PrimaryGeneratedColumn()
  option_id: number;

  @Column()
  quiz_id: number;

  @Column({ type: 'text' })
  option_text: string;

  @Column({ default: false })
  is_answer: boolean;

  @ManyToOne(() => Quiz, (quiz) => quiz.options)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}
