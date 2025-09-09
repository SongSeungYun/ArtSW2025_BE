import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlankAnswer } from '../entities/blank-answer.entity';

@Injectable()
export class BlankAnswerRepository extends Repository<BlankAnswer> {
  constructor(private dataSource: DataSource) {
    super(BlankAnswer, dataSource.createEntityManager());
  }
}
