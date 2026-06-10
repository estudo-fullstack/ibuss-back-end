import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import {
  InvalidTransactionAmountException,
  WalletUserNotFoundException,
} from "./errors/wallet-transaction.error";
import { TransactionType } from "../generated/prisma/enums";

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
        transactionType: TransactionType.DEPOSIT,
      },
      _sum: {
        transactionAmount: true,
      },
    });

    const withdrawals = await this.prismaService.walletTransaction.aggregate({
      where: {
        userId,
        transactionType: TransactionType.WITHDRAWAL,
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
          transactionType: TransactionType.DEPOSIT,
        },
      });
    } catch (error) {
      if (this.isRecordNotFoundError(error)) {
        throw new WalletUserNotFoundException();
      }
      throw error;
    }
  }

  async getExtract(userId: string, type?: TransactionType) {
    const transactions = await this.prismaService.walletTransaction.findMany({
      where: {
        userId,
        ...(type && { transactionType: type }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: Number(transaction.transactionAmount),
      type: transaction.transactionType,
      createdAt: transaction.createdAt,
    }));
  }
}
