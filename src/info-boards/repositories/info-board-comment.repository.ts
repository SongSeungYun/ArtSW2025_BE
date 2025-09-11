import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InfoBoardComment } from '../entities/info-board-comment.entity';

@Injectable()
export class InfoBoardCommentRepository extends Repository<InfoBoardComment> {
  constructor(private dataSource: DataSource) {
    super(InfoBoardComment, dataSource.createEntityManager());
  }
}
