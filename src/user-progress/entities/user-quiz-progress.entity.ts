import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
  schema: 'prompting',
  name: 'user_quiz_progress',
})
@Unique('UQ_user_quiz_type', ['user', 'type'])
export class UserQuizProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ default: false })
  passed: boolean;

  @ManyToOne(() => User, (user) => user.quizProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
