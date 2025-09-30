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
import { User } from '../../users/entities/user.entity';
import { InfoBoard } from './info-board.entity';

@Entity('info_board_comments', { schema: 'board' })
@Index(['info_board_id', 'created_at'])
export class InfoBoardComment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  comment_id: number;

  @Index(['info_board_id'])
  @Column({ type: 'bigint' })
  info_board_id: number;

  @Index(['user_id'])
  @Column({ type: 'uuid' })
  user_id: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => InfoBoard, (board) => board.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'info_board_id' })
  infoBoard: InfoBoard;
}
