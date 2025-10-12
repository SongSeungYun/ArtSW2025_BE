import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Method } from '../../tutorials/entities/method.entity';

@Entity('user_tutorial_progress', { schema: 'prompting' })
@Unique(['user', 'method'])
export class UserTutorialProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  method_id: number;

  @Column({ default: false })
  is_tutorial_completed: boolean;

  @Column({ default: false })
  is_multiple_choice_quiz_completed: boolean;

  @Column({ default: false })
  is_short_answer_quiz_completed: boolean;

  @ManyToOne(() => User, (user) => user.tutorialProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Method, (method) => method.progress)
  @JoinColumn({ name: 'method_id' })
  method: Method;
}
