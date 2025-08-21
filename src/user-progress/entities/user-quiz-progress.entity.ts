import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { User } from '../../users/entities/user.entity'; // Assuming a User entity exists

@Entity('UserQuizProgress')
export class UserQuizProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column()
  user_id: number;

  @Column()
  quiz_id: number;

  @Column({ default: false })
  passed: boolean;

  @ManyToOne(() => User, (user) => user.quizProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.progress)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;
}
