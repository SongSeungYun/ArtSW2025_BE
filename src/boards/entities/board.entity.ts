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
import { BoardImage } from './board-image.entity';
import { BoardComment } from './board-comment.entity';

export enum BoardType {
  INFO = 'INFO',
  GALLERY = 'GALLERY',
}

@Entity('Boards', { schema: 'Board' })
export class Board {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  board_id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  board_type: BoardType;

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

  @OneToMany(() => BoardImage, (image) => image.board, { cascade: true })
  images: BoardImage[];

  @OneToMany(() => BoardComment, (comment) => comment.board, { cascade: true })
  comments: BoardComment[];
}
