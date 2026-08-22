import { IsNotEmpty, IsString } from "class-validator";
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
}
