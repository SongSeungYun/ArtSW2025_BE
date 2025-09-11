import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GalleryBoard } from '../entities/gallery-board.entity';

@Injectable()
export class GalleryBoardRepository extends Repository<GalleryBoard> {
  constructor(private dataSource: DataSource) {
    super(GalleryBoard, dataSource.createEntityManager());
  }
}
