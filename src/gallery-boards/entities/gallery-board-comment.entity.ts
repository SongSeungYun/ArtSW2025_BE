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
import { GalleryBoard } from './gallery-board.entity';

@Entity('gallery_board_comments', { schema: 'board' })
@Index(['gallery_board_id', 'created_at'])
export class GalleryBoardComment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  comment_id: number;

  @Index(['gallery_board_id'])
  @Column({ type: 'bigint' })
  gallery_board_id: number;

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

  @ManyToOne(() => GalleryBoard, (board) => board.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gallery_board_id' })
  galleryBoard: GalleryBoard;
}
