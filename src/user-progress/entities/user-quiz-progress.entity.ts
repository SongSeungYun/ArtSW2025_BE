import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Assuming a User entity exists

@Entity({ schema: 'prompting', name: 'user_quiz_progress' })
export class UserQuizProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Index(['user_id'])
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: false })
  passed: boolean;

  @ManyToOne(() => User, (user) => user.quizProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
