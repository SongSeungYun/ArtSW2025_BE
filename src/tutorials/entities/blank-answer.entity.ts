import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tutorial } from './tutorial.entity';

@Entity('blank_answers', { schema: 'prompting' })
export class BlankAnswer {
  @PrimaryGeneratedColumn({ name: 'blank_answer_id' })
  blankAnswerId: number;

  @Column()
  tutorial_id: number;

  @Column('text')
  answer: string;

  @Column('int')
  order: number;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.blankAnswers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutorial_id' })
  tutorial: Tutorial;
}
