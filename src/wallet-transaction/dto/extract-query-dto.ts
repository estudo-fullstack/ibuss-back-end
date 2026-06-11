import { IsEnum, IsOptional } from "class-validator";
import { TransactionType } from "../../generated/prisma/enums";
import { Transform } from "class-transformer";

export class ExtractQueryDto {
  @IsEnum(TransactionType, {
    message: `type must be 'DEPOSIT' or 'WITHDRAWAL'`,
  })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  type?: TransactionType;
}
