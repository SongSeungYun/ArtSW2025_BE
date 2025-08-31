// Path: src/user-progress/entities/user-tutorial-progress.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TutorialStatus } from '../../common/enums/tutorial-status.enum';
import { Method } from '../../tutorials/entities/method.entity';

@Entity('usertutorialprogress', { schema: 'prompting' })
export class UserTutorialProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

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