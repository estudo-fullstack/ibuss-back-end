import {
  IsEmail,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsString()
  @IsHexadecimal()
  @Length(64, 64)
  token!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  password!: string;
}
