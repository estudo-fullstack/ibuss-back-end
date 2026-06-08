import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "../generated/prisma/client";
import {
  InsufficientBalanceException,
  InvalidTransactionAmountException,
  WalletUserNotFoundException,
} from "./errors/wallet-transaction.error";

@Injectable()
export class WalletTransactionService {
  constructor(private prismaService: PrismaService) {}

  private isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
  }

  async getBalance(userId: string) {
    const deposits = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: "DEPOSIT",
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const withdrawals = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: "WITHDRAWAL",
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const totalDeposits = Number(deposits._sum.transactionAmount ?? 0);

    const totalWithdrawals = Number(withdrawals._sum.transactionAmount ?? 0);

    return totalDeposits - totalWithdrawals;
  }

  async deposit(userId: string, amount: number) {
    if (amount <= 0) {
      throw new InvalidTransactionAmountException("Deposit amount must be greater than zero");
    }

    try {

      return this.prismaService.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(amount),
          transactionType: "DEPOSIT",
        },
      });

    }  catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new WalletUserNotFoundException();
      }
      throw error;
    }  
  }

  async withdraw(userId: string, amount: number) {
    if (amount <= 0) {
      throw new InvalidTransactionAmountException("Withdrawal amount must be greater than zero");
    }

    const balance = await this.getBalance(userId);
    if (balance < amount) {
      throw new InsufficientBalanceException("Insufficient balance");
    }

    try {
      return this.prismaService.walletTransaction.create({
        data: {
          userId,
          transactionAmount: new Prisma.Decimal(amount),
          transactionType: "WITHDRAWAL",
        },
      });

    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new WalletUserNotFoundException();
      }
      throw error;
    }
  }
}
