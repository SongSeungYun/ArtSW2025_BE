// Path: src/tutorials/entities/method.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'; // Added Index
import { Tutorial } from './tutorial.entity';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';

@Entity('methods', { schema: 'prompting' })
export class Method {
  @Index(['method_id']) // Added Index
  @PrimaryGeneratedColumn()
  method_id: number;

  @Column({ type: 'varchar', length: 50 })
  method_name: string;

  @OneToMany(() => Tutorial, tutorial => tutorial.method)
  tutorials: Tutorial[];

  @OneToMany(() => UserTutorialProgress, progress => progress.method)
  progress: UserTutorialProgress[];
}