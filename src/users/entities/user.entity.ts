import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, OneToOne } from 'typeorm';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';
import { UserQuizProgress } from '../../user-progress/entities/user-quiz-progress.entity';
import { LocalAuth } from './local-auth.entity';
import { SocialAuth } from './social-auth.entity';

@Entity('User', { schema: 'prompting' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => LocalAuth, localAuth => localAuth.user)
  localAuth: LocalAuth;

  @OneToMany(() => SocialAuth, socialAuth => socialAuth.user)
  socialAuths: SocialAuth[];

  @OneToMany(() => UserTutorialProgress, (progress) => progress.user)
  tutorialProgress: UserTutorialProgress[];

  @OneToMany(() => UserQuizProgress, (progress) => progress.user)
  quizProgress: UserQuizProgress[];
}