import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Board, BoardType } from '../entities/board.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async findRecentGalleryBoards(): Promise<Board[]> {
    return this.find({
      where: { board_type: BoardType.GALLERY },
      order: { created_at: 'DESC' },
      take: 10,
      relations: ['user', 'images'],
    });
  }
}
