import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class ListRoutesQueryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  origin!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  destination!: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  @IsIn(["asc", "desc"], {
    message: `priceOrder must be 'asc' or 'desc'`,
  })
  priceOrder?: "asc" | "desc";
}
