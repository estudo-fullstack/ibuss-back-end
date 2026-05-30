/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";
import { IsCPF } from "../../common/validators/is-cpf-validator";

export class CreateUserDto {
  @IsNotEmpty()
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
  @MinLength(5)
  password!: string;
}
