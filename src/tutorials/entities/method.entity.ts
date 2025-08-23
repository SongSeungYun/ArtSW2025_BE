// Path: src/tutorials/entities/method.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tutorial } from './tutorial.entity';
import { UserTutorialProgress } from '../../user-progress/entities/user-tutorial-progress.entity';

@Entity('method', { schema: 'prompting' })
export class Method {
  @PrimaryGeneratedColumn()
  method_id: number;

  @Column({ type: 'varchar', length: 50 })
  method_name: string;

  @OneToMany(() => Tutorial, tutorial => tutorial.method)
  tutorials: Tutorial[];

  @OneToMany(() => UserTutorialProgress, progress => progress.method)
  progress: UserTutorialProgress[];
}