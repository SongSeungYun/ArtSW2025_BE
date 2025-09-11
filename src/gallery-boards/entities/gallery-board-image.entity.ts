import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GalleryBoard } from './gallery-board.entity';

@Entity('GalleryBoardImages', { schema: 'Board' })
export class GalleryBoardImage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  image_id: number;

  @Column({ type: 'bigint' })
  gallery_board_id: number;

  @Column({ type: 'varchar', length: 1024 })
  image_url: string;

  @Column('int')
  sort_order: number;

  @ManyToOne(() => GalleryBoard, (board) => board.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gallery_board_id' })
  galleryBoard: GalleryBoard;
}
