import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';
import { Method } from './method.entity';

@Entity('Tutorial')
export class Tutorial {
  @PrimaryGeneratedColumn()
  tutorial_id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  content: string;

  // Method와의 관계 설정 (ManyToOne)
  @Column()
  method_id: number;

  @OneToMany(() => UserTutorialProgress, (progress) => progress.tutorial)
  progress: UserTutorialProgress[];
}
