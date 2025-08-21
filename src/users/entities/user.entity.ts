import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';
import { UserQuizProgress } from '../../user-progress/entities/user-quiz-progress.entity';

@Entity('User') // Assuming a 'User' table exists
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  // Add other user properties like username, email, password etc.
  @Column({ unique: true })
  email: string;

  @OneToMany(() => UserTutorialProgress, (progress) => progress.user)
  tutorialProgress: UserTutorialProgress[];

  @OneToMany(() => UserQuizProgress, (progress) => progress.user)
  quizProgress: UserQuizProgress[];
}