import { HttpStatus } from "@nestjs/common";
import AppError from "../../common/errors/app-error.error";

export class InvalidCredentialsException extends AppError {
    constructor(message = "Credenciais inválidas") {
    super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class UserInactiveException extends AppError {
    constructor(message = "Usuário inativo") {
    super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class UserSuspendedException extends AppError {
    constructor(message = "Usuário suspenso") {
    super(message, HttpStatus.UNAUTHORIZED);
    }
}