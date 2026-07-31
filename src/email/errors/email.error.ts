import { HttpStatus } from "@nestjs/common";
import AppError from "../../common/errors/app-error.error";

export class EmailNotSentException extends AppError {
  constructor(message = "Failed to send email") {
    super(message, HttpStatus.BAD_GATEWAY);
  }
}
