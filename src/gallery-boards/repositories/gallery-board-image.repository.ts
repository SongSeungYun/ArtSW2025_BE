import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GalleryBoardImage } from '../entities/gallery-board-image.entity';

@Injectable()
export class GalleryBoardImageRepository extends Repository<GalleryBoardImage> {
  constructor(private dataSource: DataSource) {
    super(GalleryBoardImage, dataSource.createEntityManager());
  }
}
