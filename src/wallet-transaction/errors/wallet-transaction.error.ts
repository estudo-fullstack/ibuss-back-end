import { HttpStatus } from "@nestjs/common";
import AppError from "../../common/errors/app-error.error";

export class InsufficientBalanceException extends AppError {
    constructor(message = "Insufficient balance") {
    super(message, HttpStatus.BAD_REQUEST);
    }
}

export class InvalidTransactionAmountException extends AppError {
    constructor(message = "Transaction amount must be greater than zero") {
    super(message, HttpStatus.BAD_REQUEST);
    }
}

export class WalletUserNotFoundException extends AppError {
    constructor(message = "User not found") {
    super(message, HttpStatus.NOT_FOUND);
    }
}

export class UserNotAuthenticatedException extends AppError {
    constructor(message = "User not authenticated") {
    super(message, HttpStatus.UNAUTHORIZED);
    }
}