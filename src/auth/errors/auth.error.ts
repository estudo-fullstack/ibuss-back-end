import { HttpStatus } from "@nestjs/common";
import AppError from "../../common/errors/app-error.error";

export class InvalidCredentialsException extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UserInactiveException extends AppError {
  constructor(message = "Inactive user") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UserSuspendedException extends AppError {
  constructor(message = "Suspended user") {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class PasswordResetTokenNotFoundException extends AppError {
  constructor(message = "Token not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class PasswordResetTokenConflictException extends AppError {
  constructor(message = "Conflict while creating password reset token") {
    super(message, HttpStatus.CONFLICT);
  }
}
