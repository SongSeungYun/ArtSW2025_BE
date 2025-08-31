import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';
import { UserQuizProgress } from '../../user-progress/entities/user-quiz-progress.entity';
import { LocalAuth } from './local-auth.entity';
import { SocialAuth } from './social-auth.entity';

@Entity({ schema: 'auth', name:'Users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => LocalAuth, localAuth => localAuth.user)
  localAuth: LocalAuth;

  @OneToMany(() => SocialAuth, socialAuth => socialAuth.user)
  socialAuths: SocialAuth[];

  @OneToMany(() => UserTutorialProgress, (progress) => progress.user)
  tutorialProgress: UserTutorialProgress[];

  @OneToMany(() => UserQuizProgress, (progress) => progress.user)
  quizProgress: UserQuizProgress[];
}