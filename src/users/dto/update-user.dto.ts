import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

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
  email?: string;
  phone_number?: string;
}
