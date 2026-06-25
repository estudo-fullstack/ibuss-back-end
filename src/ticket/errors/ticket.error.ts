import { HttpStatus } from "@nestjs/common";
import AppError from "src/common/errors/app-error.error";

export class TicketNotFoundException extends AppError {
  constructor(message = "Ticket not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}
