import { IsEnum } from 'class-validator';
import { TutorialStatus } from '../../common/enums/tutorial-status.enum';

export class UpdateUserProgressDto {
  @IsEnum(TutorialStatus)
  status: TutorialStatus;
}
