/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @MinLength(5)
  password!: string;
}
