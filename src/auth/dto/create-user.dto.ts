import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsCPF } from "../../common/validators/is-cpf-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsNotEmpty()
  @IsCPF({ message: "CPF invalid" })
  cpf!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsPhoneNumber("BR")
  phoneNumber!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  password!: string;
}
