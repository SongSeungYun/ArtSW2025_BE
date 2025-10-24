import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GalleryBoardImage } from './gallery-board-image.entity';
import { GalleryBoardComment } from './gallery-board-comment.entity';

@Entity('gallery_boards', { schema: 'board' })
export class GalleryBoard {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  gallery_board_id: number;

  @Index(['user_id'])
  @Column({ type: 'uuid' })
  user_id: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', { nullable: true })
  used_ai: string;

  @Column('text', { nullable: true })
  prompt: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => GalleryBoardImage, (image) => image.galleryBoard, { cascade: true })
  images: GalleryBoardImage[];

  @OneToMany(() => GalleryBoardComment, (comment) => comment.galleryBoard, { cascade: true })
  comments: GalleryBoardComment[];
}
