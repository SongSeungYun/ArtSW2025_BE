import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InfoBoardComment } from './info-board-comment.entity';

@Entity('InfoBoards', { schema: 'Board' })
export class InfoBoard {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  info_board_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => InfoBoardComment, (comment) => comment.infoBoard, { cascade: true })
  comments: InfoBoardComment[];
}
