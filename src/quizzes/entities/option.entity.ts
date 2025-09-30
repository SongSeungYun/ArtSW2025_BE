import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'; // Added Index
import { Quiz } from './quiz.entity';

@Entity({ schema: 'prompting', name: 'quiz_options' })
export class Option {
  @PrimaryGeneratedColumn()
  option_id: number;

  @Index(['quiz_id']) // Added Index
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
