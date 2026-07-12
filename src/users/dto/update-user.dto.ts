/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber("BR")
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  avatarId?: string;
}
