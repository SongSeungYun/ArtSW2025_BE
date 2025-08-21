import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tutorial } from '../../tutorials/entities/tutorial.entity';
import { User } from '../../users/entities/user.entity'; // Assuming a User entity exists
import { TutorialStatus } from '../../common/enums/tutorial-status.enum';

@Entity('UserTutorialProgress')
export class UserTutorialProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @Column()
  user_id: number;

  @Column()
  tutorial_id: number;

  @Column({
    type: 'enum',
    enum: TutorialStatus,
  })
  tutorial_status: TutorialStatus;

  @ManyToOne(() => User, (user) => user.tutorialProgress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.progress)
  @JoinColumn({ name: 'tutorial_id' })
  tutorial: Tutorial;
}
