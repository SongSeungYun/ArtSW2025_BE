import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Board } from './board.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'BoardComments' })
@Index(['board_id', 'created_at'])
export class BoardComment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  comment_id: number;

  @Column({ type: 'bigint' })
  board_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Board, (board) => board.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
