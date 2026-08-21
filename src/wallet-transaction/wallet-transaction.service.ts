import { Injectable } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import {
  InvalidTransactionAmountException,
  WalletUserNotFoundException,
} from "./errors/wallet-transaction.error";
import { WalletRepository } from "./wallet.repository";
import { ExtractQueryDto } from "./dto/extract-query-dto";

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
      return this.walletRepository.deposit(userId, Prisma.Decimal(amount));
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new WalletUserNotFoundException();
      }
      throw error;
    }
  }

  async getExtract(userId: string, queryDto?: ExtractQueryDto) {
    return this.walletRepository.getExtract(userId, queryDto);
  }
}
