import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import {
  InvalidTransactionAmountException,
  WalletUserNotFoundException,
} from "./errors/wallet-transaction.error";
import { TransactionType } from "../generated/prisma/enums";
import { WalletRepository } from "./wallet.repository";

@Injectable()
export class WalletTransactionService {
  constructor(private readonly walletRepository: WalletRepository) {}

  private isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  async getBalance(userId: string) {
    return this.walletRepository.getBalance(userId);
  }

  async deposit(userId: string, amount: number) {
    if (amount <= 0) {
      throw new InvalidTransactionAmountException("Deposit amount must be greater than zero");
    }

    try {
      return this.walletRepository.deposit(userId, amount);
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new WalletUserNotFoundException();
      }
      throw error;
    }
  }

  async getExtract(userId: string, type?: TransactionType) {
    return this.walletRepository.getExtract(userId, type);
  }
}
