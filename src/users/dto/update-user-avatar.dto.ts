/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MaxLength } from "class-validator";

export class UpdateUserAvatarDto {
  @IsString()
  @MaxLength(100)
  avatarId!: string;
}
