import { HttpStatus } from "@nestjs/common";
import AppError from "src/common/errors/app-error.error";

export class UserNotFoundException extends AppError {
  constructor(message = "User not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}
