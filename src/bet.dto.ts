import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsIn,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class BetDto {
  @IsNumber()
  betAmount: number;

  @IsIn(['odd', 'even', ...new Array(37).keys()])
  betType: 'odd' | 'even' | number;
}

export class BetInfoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  betInfo: BetDto[];
}
