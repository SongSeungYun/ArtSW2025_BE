import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'BoardImages' })
@Unique(['board_id', 'sort_order'])
export class BoardImage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  image_id: number;

  @Column({ type: 'bigint' })
  board_id: number;

  @Column({ type: 'varchar', length: 1024 })
  image_url: string;

  @Column('int')
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Board, (board) => board.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
