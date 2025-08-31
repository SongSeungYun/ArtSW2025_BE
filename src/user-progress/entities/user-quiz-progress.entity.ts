import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Assuming a User entity exists

@Entity({ schema: 'prompting', name: 'userquizprogress'})
export class UserQuizProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: false })
  passed: boolean;

  @ManyToOne(() => User, (user) => user.quizProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
