import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Option } from './option.entity';
import { Method } from '../../tutorials/entities/method.entity';

@Entity('quizzes', { schema: 'prompting' })
export class Quiz {
  @PrimaryGeneratedColumn()
  quiz_id: number;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  method_id: number;

  @ManyToOne(() => Method, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'method_id' })
  method: Method;

  @OneToMany(() => Option, (option) => option.quiz)
  options: Option[];
}
