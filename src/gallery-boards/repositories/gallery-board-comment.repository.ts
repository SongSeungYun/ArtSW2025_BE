import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GalleryBoardComment } from '../entities/gallery-board-comment.entity';

@Injectable()
export class GalleryBoardCommentRepository extends Repository<GalleryBoardComment> {
  constructor(private dataSource: DataSource) {
    super(GalleryBoardComment, dataSource.createEntityManager());
  }
}
