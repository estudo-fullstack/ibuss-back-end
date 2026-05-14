/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsPhoneNumber } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * Permitir atualizar apenas:
   * nome
   * email
   * telefone
   *
   * Não permitir alterar: cpf
   */
  name?: string;

  @IsEmail()
  email?: string;

  @IsPhoneNumber("BR")
  phoneNumber?: string;
}
