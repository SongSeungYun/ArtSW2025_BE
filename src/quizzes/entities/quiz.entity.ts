import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { UserQuizProgress } from '../../user-progress/entities/user-quiz-progress.entity';

@Entity('Quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  quiz_id: number;

  @Column()
  method_id: number;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Option, (option) => option.quiz)
  options: Option[];

  @OneToMany(() => UserQuizProgress, (progress) => progress.quiz)
  progress: UserQuizProgress[];
}
