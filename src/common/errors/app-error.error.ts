import { HttpException, HttpStatus } from "@nestjs/common";

export default class AppError extends HttpException {
  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
    this.name = new.target.name;
  }
}
