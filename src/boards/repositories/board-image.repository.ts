import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';

@Injectable()
export class BoardImageRepository extends Repository<BoardImage> {
  constructor(private dataSource: DataSource) {
    super(BoardImage, dataSource.createEntityManager());
  }
}
