import { HttpStatus } from "@nestjs/common";
import AppError from "../../common/errors/app-error.error";

export class UserNotFoundException extends AppError {
  constructor(message = "User not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends AppError {
  constructor(message = "User already exists") {
    super(message, HttpStatus.CONFLICT);
  }
}