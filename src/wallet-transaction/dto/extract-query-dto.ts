import { IsEnum, IsOptional } from "class-validator";
import { TransactionType } from "../../generated/prisma/enums";
import { Transform, Type } from "class-transformer";

export class ExtractQueryDto {
  @IsEnum(TransactionType, {
    message: `type must be 'DEPOSIT' or 'WITHDRAWAL'`,
  })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  type?: TransactionType;

  @IsOptional()
  @IsEnum([15, 30], {
    message: `Time period in days must be 15 or 30`,
  })
  @Type(() => Number)
  timePeriodInDays?: 15 | 30 | undefined;
}
