/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class ChangeUserPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  currentPassword!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  newPassword!: string;
}
