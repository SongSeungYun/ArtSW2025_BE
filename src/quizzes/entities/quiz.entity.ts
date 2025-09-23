import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';

@Entity('quizzes', { schema: 'prompting' })
export class Quiz {
  @PrimaryGeneratedColumn()
  quiz_id: number;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Option, (option) => option.quiz)
  options: Option[];
}
