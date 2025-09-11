import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InfoBoard } from '../entities/info-board.entity';

@Injectable()
export class InfoBoardRepository extends Repository<InfoBoard> {
  constructor(private dataSource: DataSource) {
    super(InfoBoard, dataSource.createEntityManager());
  }
}
