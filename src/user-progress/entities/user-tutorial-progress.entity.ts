// Path: src/user-progress/entities/user-tutorial-progress.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'; // Added Index
import { User } from '../../users/entities/user.entity';
import { TutorialStatus } from '../../common/enums/tutorial-status.enum';
import { Method } from '../../tutorials/entities/method.entity';

@Entity('user_tutorial_progress', { schema: 'prompting' })
export class UserTutorialProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Index(['user_id']) // Added Index
  @Column({ type: 'uuid' })
  user_id: string;

  @Index(['method_id']) // Added Index
  @Column()
  method_id: number;

  @Column({
    type: 'enum',
    enum: TutorialStatus,
  })
  tutorial_status: TutorialStatus;

  @ManyToOne(() => User, (user) => user.tutorialProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Method, (method) => method.progress)
  @JoinColumn({ name: 'method_id' })
  method: Method;
}